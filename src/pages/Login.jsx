// img
import logoImg from "../assets/images/logo/logo-affiliate-01.svg";
// Components
import InputField from "../components/unit/InputField";
import LoadingDots from "../components/unit/LoadingDots";
import ModalWrap from "../components/modal/ModalWrap";
import ConfirmModal from "../components/modal/ConfirmModal";
// style
import "../styles/pages/Login.scss";
// 외부 라이브러리 및 패키지
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// Login.jsx 내 성공 시
import { redirectPathByRole } from "../utils/auth";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function Login() {
  // 사용자 아이디 & 비번 상태
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  // 로그인 성공 화면 이동
  const navigate = useNavigate();
  // 로그인 실패 모달 상태
  const [showFailModal, setShowFailModal] = useState(false);
  // 인풋 유효성 검사 (임시)
  const isFormValid = userId.trim() !== "" && userPw.trim() !== "";
  // API data 가져오는 텀
  const [isLoading, setIsLoading] = useState(false);
  // 로그인 성공실패 여부 함수
  const handleIsLogin = async () => {
    setIsLoading(true);
    //api get으로 받아와서 유저 정보 일치하는지 확인하는 코드
    try {
      const res = await axios.get(`${serverAPI}/api/user/login`, {
        params: {
          username: userId,
          password: userPw,
        },
      });

      // console.log("res.data코드확인중..!", res.data);
      if (res.data?.token) {
        // 로그인 성공 처리
        console.log("✅ 로그인 성공!", res.data);
        // 1. 토큰 저장
        localStorage.setItem("userToken", res.data.token);
        // 2. 이메일 저장
        localStorage.setItem("userEmail", userId.trim());
        // 3. 역할 저장 (없으면 이메일로 판단)
        const role = userId.trim() === "nisoft83@naver.com" ? "master" : "user";
        localStorage.setItem("userRole", role);
        // 메인 (Dashboard 페이지로 이동)
        // if (role == "master") {
        //   navigate("/master-dashboard-doing");
        // } else {
        //   navigate("/dashboard");
        // }
        // ✅ replace: true로 뒤로가기 방지
        navigate(redirectPathByRole(role), { replace: true });
      } else {
        // 로그인 실패 처리
        console.warn("❌ 로그인 실패. 사용자 정보 불일치.");
        setShowFailModal(true);
      }
    } catch (error) {
      console.error("🚨 서버 오류 또는 네트워크 문제", error);
      setShowFailModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login login__wrapper">
      <div className="login__box">
        <h1 className="login__logo">
          <img src={logoImg} alt="Music On the Block Affiliate Logo" />
          <span>Welcome to our affiliate service</span>
        </h1>

        <form
          className="login__form"
          onSubmit={(e) => {
            // 기본 제출 방지
            e.preventDefault();
            handleIsLogin();
          }}
        >
          <fieldset>
            <InputField
              id="userId"
              label="ID"
              type="email"
              placeholder="Please enter your ID"
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <InputField
              id="userPw"
              label="Password"
              type="password"
              placeholder="Please enter your Password"
              required
              withToggle={true}
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
            />
          </fieldset>
          <button
            type="submit"
            className={`btn btn-login ${
              isFormValid ? `btn--active` : `btn--disabled`
            }`}
            disabled={!isFormValid || isLoading}
            onClick={handleIsLogin}
          >
            Login
            <LoadingDots />
            {/* 비활성화--disabled / 활성화--active / 로딩 중--loading */}
          </button>
        </form>

        <Link to="/signup" className="btn btn-signup">
          회원가입
        </Link>
      </div>
      {showFailModal && (
        // 로그인 실패 시 로그인 실패 모달 띄우기
        <ConfirmModal
          title="Login Failed"
          message="The account information does not match our records."
          buttonText="OK"
          onClose={() => setShowFailModal(false)}
        />
      )}
    </div>
  );
}

export default Login;
