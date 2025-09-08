// 로컬스토리지 키
const TOKEN_KEY = "userToken";
const ROLE_KEY = "userRole"; // 'master' | 'user' | null

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);

// base64url 디코더
function b64urlDecode(str) {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return null;
  }
}

// JWT payload 파서
function parseJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payloadStr = b64urlDecode(parts[1]);
  if (!payloadStr) return null;
  try {
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

// 유효 토큰(만료 전)인지 확인
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const payload = parseJwtPayload(token);
  if (!payload) return false; // JWT 형식이 아니면 미인증 처리
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= now) return false; // exp 없거나 만료면 미인증

  return true;
};

// 역할별 기본 진입 경로
export const redirectPathByRole = (role) => {
  if (role === "master") return "/master-dashboard-doing";
  return "/dashboard";
};
