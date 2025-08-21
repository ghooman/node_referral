// src/components/routes/RoleRoute.jsx
// 역할별 접근 제어
// URL을 직접 입력해도 역할에 맞는 페이지만 접근 가능 (마스터-유저 교차 접근 차단하기!)
import { Navigate } from "react-router-dom";
import { getRole, redirectPathByRole } from "../../utils/auth";

export default function RoleRoute({ allowedRoles = [], children }) {
  const role = getRole();
  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectPathByRole(role)} replace />;
  }
  return children;
}
