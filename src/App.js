import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
// style
import "./App.css";
import "./styles/Main.scss";
// Route
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 공개 접근 가능한 페이지 */}
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* 보호된 페이지는 모두 여기 아래에서 감쌈 */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <ProtectedRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
