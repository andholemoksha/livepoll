import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import TeacherStart from "./pages/TeacherStart";
import TeacherPoll from "./pages/TeacherPoll";
import StudentStart from "./pages/StudentStart";
import StudentPoll from "./pages/StudentPoll";
import StudentPollSubmit from "./pages/StudentPollSubmit";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/teacher" element={<TeacherStart />} />
          <Route path="/teacher/poll" element={<TeacherPoll />} />
          <Route path="/student" element={<StudentStart />} />
          <Route path="/student/poll" element={<StudentPoll />} />
          <Route path="/student/poll/submit" element={<StudentPollSubmit />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
