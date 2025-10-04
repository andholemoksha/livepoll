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
    origin: "http://localhost:5173", // allow React frontend
    methods: ["GET", "POST"]
  }
});
app.use(express.json());
app.use(cors());

const POLL_FILE = './polls.json';

// Helper: read/write JSON file
const readPolls = () => {
  if (!fs.existsSync(POLL_FILE)) fs.writeFileSync(POLL_FILE, '{}');
  return JSON.parse(fs.readFileSync(POLL_FILE));
};

const savePolls = (data) => fs.writeFileSync(POLL_FILE, JSON.stringify(data, null, 2));

let activePolls = {}; // in-memory structure for live sessions
let activePollsTeachers = {}; // to track teachers
let activePollsStudents = {}; // to track students


// Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('connected', { socketId: socket.id });


  socket.on('create-poll', () => {
    // const pollId = randomUUID();
    const pollId = "abc"
    activePolls[pollId] = {
      students: {},
      questions: [],
      currentQuestionIndex: -1,
      lastQuestionActive: false
    };
    activePollsTeachers[socket.id] = pollId;
    socket.join(pollId);
    socket.emit('joined', { pollId });
    console.log(`Teacher created poll ${pollId}`);
  });


  socket.on('add-question', ({ question, options, timer = 60 }) => {
    const pollId = activePollsTeachers[socket.id];
    if (!activePolls[pollId]) return socket.emit('error', 'Poll not found');
    // Save full question in server (with correct info)
    activePolls[pollId].questions.push({
      question,
      options: options.map(opt => ({ ...opt, voted: 0 })),
      askedAt: Date.now(),
      timer
    });
    activePolls[pollId].currentQuestionIndex += 1;
    activePolls[pollId].lastQuestionActive = true;
    setTimeout(() => {
      activePolls[pollId].lastQuestionActive = false;
      io.to(pollId).emit('question-ended');
    }, timer * 1000);
    console.log(activePolls[pollId].questions[activePolls[pollId].currentQuestionIndex]);
    // Emit to clients only option values and voted counts
    const sanitizedOptions = options.map(opt => ({ value: opt.value }));
    io.to(activePollsTeachers[socket.id]).emit('new-question', { question, options: sanitizedOptions });
  });


  socket.on('join-poll', ({ pollId, name }) => {
    if (!activePolls[pollId]) return socket.emit('error', 'Poll not found');
    socket.join(pollId);
    activePolls[pollId].students[socket.id] = { name };
    activePollsStudents[socket.id] = pollId;
    socket.emit('joined', { pollId, name });
    io.to(pollId).emit('student-joined', { name }); 
    console.log(`Student ${name} joined poll ${pollId}`);
  });


  socket.on("vote", ({ optionIndex }) => {
  const pollId = activePollsStudents[socket.id];
  if (!pollId || !activePolls[pollId]) return socket.emit('error', 'Poll not found');

  const poll = activePolls[pollId];
  const question = poll.questions[poll.currentQuestionIndex];

  if (!poll.lastQuestionActive) return socket.emit('error', 'No active question');
  if (optionIndex < 0 || optionIndex >= question.options.length) {
    return socket.emit('error', 'Invalid option');
  }

  // Initialize votedBy map if it doesn't exist
  if (!question.votedBy) question.votedBy = {};

  // Check if this socket has already voted
  if (question.votedBy[socket.id]) {
    return socket.emit('error', 'You have already voted for this question');
  }

  // Record the vote
  question.options[optionIndex].voted += 1;
  question.votedBy[socket.id] = true;

  // Send vote-update only to this student
  socket.emit('vote-update', question.options.map(opt => ({ value: opt.value, voted: opt.voted })));

  // Check if all students have voted
  const allVoted = Object.keys(poll.students || {}).every(
    studentId => question.votedBy[studentId]
  );

  if (allVoted) {
    // End question and broadcast to everyone
    poll.lastQuestionActive = false;
    io.to(pollId).emit('question-ended', question.options.map(opt => ({ value: opt.value, voted: opt.voted })));
  }
});


  socket.onAny((event, data) => {
    console.log(`Event: ${event}, Data: ${JSON.stringify(data)}`);
  });
});

// Save poll history to JSON
function saveHistory(pollId) {
  const polls = readPolls();
  const poll = activePolls[pollId];
  if (!poll) return;

  polls[pollId] = poll.questions;
  savePolls(polls);
}

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
