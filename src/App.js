// src/App.jsx
// 로그인이랑 회원가입을 GuestOnly로 감싸기!

import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import GuestOnly from "./components/routes/GuestOnly";
import "./App.css";
import "./styles/Main.scss";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignUp />
            </GuestOnly>
          }
        />
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
