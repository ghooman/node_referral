import { Link, useNavigate, useLocation } from "react-router-dom";
// img
import logoImg from "../../assets/images/logo/logo-affiliate-02.svg";
import iconLang from "../../assets/images/icon-language.svg";
// style
import "./Header.scss";

// embla carousel
import useEmblaCarousel from 'embla-carousel-react'


function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");

    navigate("/"); // 로그인 페이지 경로에 맞게 변경
  };

  // ✅ 유저 역할에 따라 메인 이동 경로 분기
  const handleLogoClick = () => {
    const role = localStorage.getItem("userRole");
    if (role === "master") {
      navigate("/master-dashboard-doing");
    } else {
      navigate("/dashboard");
    }
  };

  const isMasterDashboard = location.pathname.startsWith("/master-dashboard");

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/sales-record", label: "My Sales Records" },
    { path: "/referral-purchase-list", label: "Referral Purchases" },
    { path: "/referral-registrants-list", label: "Referral Registrants" },
    { path: "/recommender-list", label: "Invite Code List" },
    { path: "/referral-earning-list", label: "Sub-Affiliate Earnings" },
  ];

  // embla
  const [emblaRef] = useEmblaCarousel({
    loop: false,    
    align: 'start',
    dragFree: true, 
    containScroll: 'trimSnaps' 
  })

  return (
    <>
    <header className="node-header">
      <div className="node-header__center">
        <div className="node-header__inner">
          <h1 className="node-header__inner__logo">
            <img
              onClick={handleLogoClick}
              src={logoImg}
              alt="Music On The Block Affiliate Logo"
            />
          </h1>
          <div className="node-header__actions">
            {/* <button type="button" className="node-header__lang" aria-label="Change language">
              <img src={iconLang} alt="" aria-hidden="true" />
              <span>KOR</span>
            </button> */}
            <button className="node-header__sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
        {!isMasterDashboard && (
        <div className="node-header__nav-wrap nav-carousel" ref={emblaRef}>
          {/* embla__container */}
          <ul className="nav-carousel__container">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className={`nav-carousel__item ${location.pathname === item.path ? "active" : ""}`}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </header>
    </>
  );
}

export default Header;
