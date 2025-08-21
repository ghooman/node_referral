// src/components/routes/GuestOnly.jsx
// 로그인 / 회원가입 보호
// 로그인된 사용자가 /affiliate/login//affiliate/signup 들어오면 자기 대시보드로 튕김

import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole, redirectPathByRole } from "../../utils/auth";

export default function GuestOnly({ children }) {
  if (isAuthenticated()) {
    const role = getRole();
    return <Navigate to={redirectPathByRole(role)} replace />;
  }
  return children;
}
