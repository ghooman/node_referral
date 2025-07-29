import { Link, useNavigate } from "react-router-dom";
// img
import logoImg from "../../assets/images/logo/logo-affiliate-02.svg";
import iconLang from "../../assets/images/icon-language.svg";
// style
import "./Header.scss";

function Header() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");

    navigate("/Login"); // 로그인 페이지 경로에 맞게 변경
  };

  // ✅ 유저 역할에 따라 메인 이동 경로 분기
  const handleLogoClick = () => {
    const role = localStorage.getItem("userRole");
    if (role === "master") {
      navigate("/MasterDashboardDoing");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__inner__logo">
          <img onClick={handleLogoClick} src={logoImg} alt="Music On The Block Affiliate Logo" />
        </h1>
        <div className="header__actions">
          <button type="button" className="header__lang" aria-label="Change language">
            <img src={iconLang} alt="" aria-hidden="true" />
            <span>KOR</span>
          </button>
          <button className="header__sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
