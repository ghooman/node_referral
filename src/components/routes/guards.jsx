// src/routes/guards.jsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getRole, redirectPathByRole } from "../utils/auth";

// 로그인 필요: 미인증이면 로그인으로
export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// 역할 제한: 허용 역할이 아니면 자신의 대시보드로 돌려보냄
export function RoleRoute({ allowedRoles = [] }) {
  const role = getRole();
  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectPathByRole(role)} replace />;
  }
  return <Outlet />;
}

// 게스트 전용: 이미 로그인되어 있으면 대시보드로
export function GuestOnly({ children }) {
  if (isAuthenticated()) {
    const role = getRole();
    return <Navigate to={redirectPathByRole(role)} replace />;
  }
  return children;
}
