import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
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
        <Route
          path="/student/kicked"
          element={
            <>
              <div className="p-4 text-center text-[2rem] font-bold">
                You have been kicked out of the poll.
              </div>
              <div className="p-2 text-center text-[1.5rem] font-bold">
                Looks like the teacher had removed you from the poll system. Please Try again sometime.
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
