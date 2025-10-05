import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import TeacherStart from "./pages/TeacherStart";
import TeacherPoll from "./pages/TeacherPoll";
import StudentStart from "./pages/StudentStart";
import StudentPoll from "./pages/StudentPoll";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/teacher" element={<TeacherStart />} />
          <Route path="/teacher/poll" element={<TeacherPoll />} />
          <Route path="/student" element={<StudentStart />} />
          <Route path="/student/poll" element={<StudentPoll />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
