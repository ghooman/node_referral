// src/utils/auth.js
export const getToken = () => localStorage.getItem("userToken");
export const getRole = () => localStorage.getItem("userRole"); // 'master' | 'user' | null
export const isAuthenticated = () => Boolean(getToken());

export const redirectPathByRole = (role) => {
  if (role === "master") return "/affiliate/master-dashboard-doing";
  return "/affiliate/dashboard";
};
