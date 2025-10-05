const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
const { randomUUID } = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

const POLL_FILE = './polls.json';

// ----------------------
// Helper Functions
// ----------------------
const readPolls = () => {
  if (!fs.existsSync(POLL_FILE)) fs.writeFileSync(POLL_FILE, '{}');
  return JSON.parse(fs.readFileSync(POLL_FILE));
};

const savePolls = (data) => fs.writeFileSync(POLL_FILE, JSON.stringify(data, null, 2));

function saveHistory(pollId) {
  const polls = readPolls();
  const poll = activePolls[pollId];
  if (!poll) return;

  polls[pollId] = poll.questions;
  savePolls(polls);
  console.log(`Poll ${pollId} saved to history.`);
}

// ----------------------
// In-Memory Structures
// ----------------------
let activePolls = {};         // all polls (only one at a time)
let activePollTeachers = {};  // teacher socket -> pollId
let activePollStudents = {};  // student socket -> pollId
let activePollId = '';        // current active pollId

// ----------------------
// Socket.IO Logic
// ----------------------
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('connected', { socketId: socket.id });

  // ========================
  // Create Poll (Teacher)
  // ========================
  socket.on('create-poll', () => {
    // If there’s an existing poll, close it first
    if (activePollId && activePolls[activePollId]) {
      console.log(`Closing previous poll ${activePollId}`);
      saveHistory(activePollId);
      delete activePolls[activePollId];
    }

    const pollId = randomUUID();

    activePolls[pollId] = {
      students: {},
      questions: [],
      currentQuestionIndex: -1,
      lastQuestionActive: false
    };

    activePollTeachers[socket.id] = pollId;
    activePollId = pollId;

    socket.join(pollId);
    socket.emit('joined', { pollId });

    console.log(`Teacher created poll ${pollId}`);
  });

  // ========================
  // Add Question
  // ========================
  socket.on('add-question', ({ question, options, timer = 60 }) => {
    const pollId = activePollId;
    if (!pollId || !activePolls[pollId]) return socket.emit('error', 'No active poll');

    const poll = activePolls[pollId];

    poll.questions.push({
      question,
      options: options.map(opt => ({ ...opt, voted: 0 })),
      askedAt: Date.now(),
      timer
    });

    poll.currentQuestionIndex += 1;
    poll.lastQuestionActive = true;

    // Auto-end question after timer
    setTimeout(() => {
      poll.lastQuestionActive = false;
      io.to(pollId).emit('question-ended', poll.questions[poll.currentQuestionIndex]);
    }, timer * 1000);

    const sanitizedOptions = options.map(opt => ({ value: opt.value }));
    io.to(pollId).emit('new-question', { question, options: sanitizedOptions });

    console.log(`Question added to poll ${pollId}:`, question);
  });

  // ========================
  // Student Joins Poll
  // ========================
  socket.on('join-poll', ({ name }) => {
    const pollId = activePollId;
    if (!pollId || !activePolls[pollId]) return socket.emit('error', 'No active poll available');

    activePolls[pollId].students[socket.id] = { name };
    activePollStudents[socket.id] = pollId;

    socket.join(pollId);
    socket.emit('joined', { pollId, name });
    io.to(pollId).emit('student-joined', { name });

    console.log(`Student ${name} joined poll ${pollId}`);
  });

  // ========================
  // Student Votes
  // ========================
  socket.on("vote", ({ optionIndex }) => {
    const pollId = activePollStudents[socket.id];
    if (!pollId || !activePolls[pollId]) return socket.emit('error', 'Poll not found');

    const poll = activePolls[pollId];
    const question = poll.questions[poll.currentQuestionIndex];

    if (!poll.lastQuestionActive) return socket.emit('error', 'No active question');
    if (optionIndex < 0 || optionIndex >= question.options.length)
      return socket.emit('error', 'Invalid option');

    if (!question.votedBy) question.votedBy = {};

    if (question.votedBy[socket.id])
      return socket.emit('error', 'You have already voted for this question');

    question.options[optionIndex].voted += 1;
    question.votedBy[socket.id] = true;

    const totalVotes = Object.keys(question.votedBy).length;

    // Send update to all students
    io.to(pollId).emit('vote-update', question.options.map(opt => ({
      text: opt.value,
      percentage: (opt.voted / totalVotes) * 100
    })));

    // Check if all students have voted
    const allVoted = Object.keys(poll.students || {}).every(
      studentId => question.votedBy[studentId]
    );

    if (allVoted) {
      poll.lastQuestionActive = false;
      io.to(pollId).emit('question-ended', question.options.map(opt => ({
        value: opt.value,
        voted: opt.voted
      })));
    }
  });

  // ========================
  // Teacher Disconnect
  // ========================
  socket.on('disconnect', () => {
    const pollId = activePollTeachers[socket.id];
    if (pollId && activePolls[pollId]) {
      console.log(`Teacher disconnected. Ending poll ${pollId}`);
      saveHistory(pollId);
      delete activePolls[pollId];
      activePollId = '';
      io.to(pollId).emit('poll-ended');
    }
    delete activePollTeachers[socket.id];
    delete activePollStudents[socket.id];
  });

  // Debug logging
  socket.onAny((event, data) => {
    console.log(`Event: ${event}, Data: ${JSON.stringify(data)}`);
  });
});

// ----------------------
// Server Start
// ----------------------
const PORT = 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
