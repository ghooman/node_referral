// Components
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import LoadingDots from "../components/unit/LoadingDots";
import ModalWrap from "../components/modal/ModalWrap";
import CopyButton from "../components/unit/CopyButton";
import InputField from "../components/unit/InputField";
import Loading from "../components/Loading.jsx";
// img
import penIcon from "../assets/images/icon-pen.svg";
import closeBtn from "../assets/images/icon-close.svg";
// style
import "../styles/pages/Dashboard.scss";
// 외부 라이브러리 및 패키지
import axios from "axios";
import React, { useState, useEffect } from "react";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function Dashboard() {
  //----- 상태 ------------------------------------------------------------------------------------
  // 사용자 정보 상태
  const [userName, setUserName] = useState("");
  const [userShare, setUserShare] = useState("");
  const [userWallet, setUserWallet] = useState("");
  const [userOfficeWallet, setUserOfficeWallet] = useState("");
  const [userReferral, setUserReferral] = useState("");

  const [userWalletInput, setUserWalletInput] = useState("");
  const [userWalletEdit, setUserWalletEdit] = useState("");

  const userToken = localStorage.getItem("userToken");

  // 버튼 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 페이지 로딩
  const [isPageLoading, setIsPageLoading] = useState(false);

  // 지갑주소 등록 모달 오픈
  const [isOpenAddWalletModal, setIsOpenAddWalletModal] = useState(false);
  // 지갑주소 수정 모달 오픈
  const [isOpenEditWalletModal, setIsOpenEditWalletModal] = useState(false);

  //---- 대시보드 상태 ----------------------------------------------------
  // total 대시보드
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSettlement, setTotalSettlement] = useState(0);
  const [totalSoldNode, setTotalSoldNode] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalRecommendPerson, setTotalRecommendPerson] = useState(0);

  // my 대시보드
  const [myRevenue, setMyRevenue] = useState(0);
  const [mySettlement, setMySettlement] = useState(0);
  const [mySoldNode, setMySoldNode] = useState(0);
  const [myReferrals, setMyReferrals] = useState(0);
  const [myRecommendPerson, setMyRecommendPerson] = useState(0);

  // referral 대시보드
  const [referralRevenue, setReferralRevenue] = useState(0);
  const [referralSettlement, setReerralSettlement] = useState(0);
  const [referralSoldNode, setReferralSoldNode] = useState(0);

  // 하위 대시보드
  const [downRevenue, setDownRevenue] = useState(0);
  const [downSettlement, setDownSettlement] = useState(0);
  const [downSoldNode, setDownSoldNode] = useState(0);
  const [downReferrals, setDownReferrals] = useState(0);
  const [downRecommendPerson, setDownRecommendPerson] = useState(0);

  // 내 레퍼럴 코드, 링크 복사 관리
  const [copiedIndex, setCopiedIndex] = useState({ code: false, link: false });

  //----- API 호출 함수  ------------------------------------------------------------------------------------
  // 사용자 정보 가져오는 함수
  const userInfo = async () => {
    setIsPageLoading(true);
    try {
      const res = await axios.get(`${serverAPI}/api/user/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("API에서 받아온 사용자 정보", res.data);
      setUserName(res.data.username);
      setUserShare(res.data.share);
      setUserWallet(res.data.wallet_address);
      setUserOfficeWallet(res.data.deposit_wallet_address);
      setUserReferral(res.data.referral_code);
    } catch (error) {
      console.error("사용자 정보 가져오는 함수 error입니당", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  // 대시보드 정보 값 가져오는 함수
  const handleGetDashboardData = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("API에서 받아온 대시보드 정보", res.data);
      // total 대시보드
      setTotalRevenue(res.data.total_revenue);
      setTotalSettlement(res.data.total_settlement);
      setTotalSoldNode(res.data.total_sold_nodes);
      setTotalReferrals(res.data.total_referrals);
      setTotalRecommendPerson(res.data.total_recommend_person);

      // my 대시보드
      setMyRevenue(res.data.my_sales_revenue);
      setMySettlement(res.data.my_settlement);
      setMySoldNode(res.data.my_sold_nodes);
      setMyReferrals(res.data.my_referrals);
      setMyRecommendPerson(res.data.my_recommend_person);

      // referral 대시보드
      setReferralRevenue(res.data.referral_buy_revenue);
      setReerralSettlement(res.data.referral_settlement);
      setReferralSoldNode(res.data.referral_sold_nodes);

      // 하위 대시보드
      setDownRevenue(res.data.downline_sales_revenue);
      setDownSettlement(res.data.downline_settlement);
      setDownSoldNode(res.data.downline_sold_nodes);
      setDownReferrals(res.data.downline_referrals);
      setDownRecommendPerson(res.data.downline_recommend_person);
    } catch (error) {
      console.error("대시보드 정보 값 가져오는 함수 error입니당", error);
    }
  };

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
  // 내 레퍼럴 코드, 링크 복사 로직
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex((prev) => ({ ...prev, code: true }));
  };
  const handleCopyLink = (code) => {
    const fullUrl = `https://purchase-node.musicontheblock.com/?r=${code}`; // 노드구매페이지 url나오면 붙이기
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex((prev) => ({ ...prev, link: true }));
  };

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString("en-US"); // "1,000", "50,000" 형태
  };

  //---- 지갑주소 ----------------------------------------------------
  // 지갑주소 클릭 함수
  const handleClickAddWalletBtn = async () => {
    setIsOpenAddWalletModal(true);
  };
  // 지갑주소 수정 클릭 함수
  const handleClickEditWalletBtn = async () => {
    setUserWalletEdit(userWallet);
    setIsOpenEditWalletModal(true);
    console.log("지갑주소 수정 함수입니당!");
    console.log("userWalletEdit", userWalletEdit);
    console.log("userWalletInput", userWalletInput);
    console.log("userWallet", userWallet);
  };
  // 지갑주소 등록하는 함수
  const handleSaveWallet = async (finalWallet) => {
    setIsLoading(true);
    try {
      console.log("서버에 보내는 지갑 주소는?!", finalWallet);
      await axios.post(`${serverAPI}/api/user/wallet/address`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },

        params: {
          wallet_address: finalWallet.trim(),
        },
      });
      console.log("지갑주소 등록/수정 완료~!", finalWallet);
      setUserWallet(finalWallet.trim()); // 여기서 지갑주소 업데이트!
      setUserWalletInput(""); // 등록용 초기화
      setUserWalletEdit(""); // 수정용 초기화
      setIsOpenAddWalletModal(false);
      setIsOpenEditWalletModal(false);
      setIsLoading(false);
      userInfo(); // 사용자 정보 새롭게 갱신하기!
    } catch (error) {
      console.error("지갑주소 등록/수정 error입니당", error);
      setIsLoading(false);
    }
  };
  // 지갑 주소 포맷팅 함수 (앞뒤 4글자씩 짜르기 0x00....0000)
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  //----- useEffect 모음  ------------------------------------------------------------------------------------
  // 내 레퍼럴 코드, 링크 복사 로직
  useEffect(() => {
    if (copiedIndex.code || copiedIndex.link) {
      const timer = setTimeout(() => {
        setCopiedIndex({ code: false, link: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  // userToken이 존재하면 사용자 정보 호출하기!
  useEffect(() => {
    if (!userToken) return;
    userInfo(); // 사용자 기본 정보
    handleGetDashboardData(); // 대시보드 데이터
  }, [userToken]);

  // 로딩 돌릴 때 header 캐러셀 안보이는 문제
  useEffect(() => {
    const headerEl = document.querySelector(".node-header"); // 실제 헤더 루트 (캡쳐 기준)

    if (!headerEl) return;

    // 최초 설정
    const setHeight = () => {
      const h = headerEl.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty("--node-header-height", `${h}px`);
    };
    setHeight();

    // 헤더(캐러셀 포함)의 높이 변화를 추적
    const ro = new ResizeObserver(() => setHeight());
    ro.observe(headerEl);

    // 뷰포트/폰트/리사이즈 등도 커버
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);

  return (
    <>
      <Header />
      <div className={`page-wrapper dashboard-wrapper ${isPageLoading ? "is-loading" : ""}`}>
        {/* 전체 페이지 로딩 오버레이 */}
        {isPageLoading && (
          <div className="loading-overlay" role="status" aria-live="polite" aria-busy={isPageLoading}>
            <div className="loading-overlay__inner">
              <Loading />
            </div>
          </div>
        )}
        <div className="user-section">
          <ul className="user-section__wallet">
            <li className="user-section__flex">
              <div className="user-section__share">
                <span>My Share</span>
                <strong className="color-blue">{userShare}%</strong>
              </div>
              <p className="user-section__email">{userName}</p>
            </li>
            <li>
              <span>Company Wallet</span>
              <div className="user-section__wallet__copy-com">
                <strong>{formatWalletAddress(userOfficeWallet)}</strong>
                <CopyButton textToCopy={userOfficeWallet} />
              </div>
            </li>
            <li>
              <span>My Wallet Address</span>
              {!userWallet ? (
                <button type="button" className="btn-register" onClick={handleClickAddWalletBtn}>
                  Register Wallet Address
                </button>
              ) : (
                <div className="user-section__wallet__copy-com">
                  <strong>{formatWalletAddress(userWallet)}</strong>
                  <CopyButton textToCopy={userWallet} />
                  <button type="button" onClick={handleClickEditWalletBtn}>
                    <img src={penIcon} alt="수정" />
                  </button>
                </div>
              )}
            </li>
            <li>
              <span>My Promo Code</span>
              <div className="user-section__referral-code-com">
                <strong>{userReferral}</strong>
                <div className="user-section__referral-code-com__btn-box">
                  <button
                    className={`btn-line-copy ${copiedIndex.code ? "copied" : ""}`}
                    onClick={() => handleCopyCode(userReferral)}
                  >
                    {copiedIndex.code ? "Copied" : "Copy Code"}
                  </button>
                  <button
                    className={`btn-line-copy ${copiedIndex.link ? "copied" : ""}`}
                    onClick={() => handleCopyLink(userReferral)}
                  >
                    {copiedIndex.link ? "Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* 대시보드 -> 데이터가 없는 경우 '0'으로 처리 */}
        <section className="dash-section">
          <h2 className="dash-section__tit">Dashboard</h2>
          <div className="dash-section__txt">
            {/* 
              전체 레퍼럴 가입자, 내 레퍼럴 가입자, 하위자 레퍼럴 가입자
              레퍼럴 구매 수입, 레퍼럴 구매 정산금, 레퍼럴 구매 노드 수 추가
            */}
            <ul className="dash-section__txt__board col-4">
              <li>
                {/* 전체 수입 */}
                <h3>Total Sales Volume</h3>
                <p>{formatNumber(totalRevenue)}</p>
              </li>
              <li>
                {/* 나의 판매 수입 */}
                <h3>My Own Sales</h3>
                <p>{formatNumber(myRevenue)}</p>
              </li>
              <li>
                {/* (new) 레퍼럴 구매 수입 */}
                <h3>Sales Volume by Direct Client</h3>
                <p>{formatNumber(referralRevenue)}</p>
              </li>
              <li>
                {/* 하위자 판매 수입 -> 하위자 거래 수입 */}
                <h3>Sales Volume by Sub-Affiliate</h3>
                <p>{formatNumber(downRevenue)}</p>
              </li>
            </ul>
            <ul className="dash-section__txt__board col-4">
              <li>
                {/* 전체 정산금 */}
                <h3>Total Commission</h3>
                <p>{formatNumber(totalSettlement)}</p>
              </li>
              <li>
                {/* 나의 판매 정산금 */}
                <h3>My Commission</h3>
                <p>{formatNumber(mySettlement)}</p>
              </li>
              <li>
                {/* (new) 레퍼럴 구매 정산금 */}
                <h3>Direct Client’s Commission</h3>
                <p>{formatNumber(referralSettlement)}</p>
              </li>
              <li>
                {/* 하위자 판매 정산금 -> 하위자 거래 정산금 */}
                <h3>Sub-Affiliate’s Commission</h3>
                <p>{formatNumber(downSettlement)}</p>
              </li>
            </ul>
            <ul className="dash-section__txt__board col-4">
              <li>
                {/* 전체 판매 노드 수 -> 전체 거래 노드 수 */}
                <h3>Total Number of Nodes Sold</h3>
                <p>{formatNumber(totalSoldNode)}</p>
              </li>
              <li>
                {/* 나의 판매 노드 수 */}
                <h3>Number of Nodes I Sold</h3>
                <p>{formatNumber(mySoldNode)}</p>
              </li>
              <li>
                {/* (new) 레퍼럴 구매 노드 수 */}
                <h3>Number of Nodes Direct Client Sold</h3>
                <p>{formatNumber(referralSoldNode)}</p>
              </li>
              <li>
                {/* 하위자 판매 노드 수 -> 하위자 거래 노드 수 */}
                <h3>Number of Nodes Sub-Affiliate Sold</h3>
                <p>{formatNumber(downSoldNode)}</p>
              </li>
            </ul>
            <ul className="dash-section__txt__board col-3">
              <li>
                {/* (new) 전체 레퍼럴 가입자 */}
                <h3>Total Number of Clients</h3>
                <p>{formatNumber(totalReferrals)}</p>
              </li>
              <li>
                {/* (new) 내 레퍼럴 가입자 */}
                <h3>My Direct Clients</h3>
                <p>{formatNumber(myReferrals)}</p>
              </li>
              <li>
                {/* (new) 하위자 레퍼럴 가입자 */}
                <h3>My Indirect Clients</h3>
                <p>{formatNumber(downReferrals)}</p>
              </li>
            </ul>
            <ul className="dash-section__txt__board col-3">
              <li>
                {/* 전체 추천인 */}
                <h3>Total Number of Sub-Affiliates</h3>
                <p>{formatNumber(totalRecommendPerson)}</p>
              </li>
              <li>
                {/* 나의 추천인 */}
                <h3>My Direct Sub-Affiliates</h3>
                <p>{formatNumber(myRecommendPerson)}</p>
              </li>
              <li>
                {/* 하위자 추천인 */}
                <h3>My Indirect Sub-Affiliates </h3>
                <p>{formatNumber(downRecommendPerson)}</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />

      {/* '지갑주소 등록' 선택 시 '지갑 등록' Modal 노출 */}
      {isOpenAddWalletModal && (
        <ModalWrap>
          <div className="modal modal-wallet">
            <div className="modal__content">
              <div className="modal__header">
                <h2>Register My Wallet</h2>
                <button type="button" onClick={() => setIsOpenAddWalletModal(false)}>
                  <img src={closeBtn} alt="팝업 닫기" />
                </button>
              </div>
              <div className="modal__body">
                <InputField
                  id="walletAddress"
                  label="My Wallet Address"
                  type="text"
                  placeholder="Enter your wallet address"
                  required
                  value={userWalletInput}
                  onChange={(e) => setUserWalletInput(e.target.value)}
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${userWalletInput ? "" : "btn--disabled"} ${
                    isLoading ? "btn--loading" : ""
                  }`}
                  disabled={!userWalletInput}
                  onClick={() => handleSaveWallet(userWalletInput)}
                >
                  {isLoading ? "Registering..." : "Register Wallet Address"}
                  <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* 지갑을 등록한 경우 지갑 주소 우측에 연필 아이콘 클릭 시 '내 지갑주소 수정' Modal 노출 */}
      {isOpenEditWalletModal && (
        <ModalWrap>
          <div className="modal modal-wallet">
            <div className="modal__content">
              <div className="modal__header">
                <h2>Edit My Wallet Address</h2>
                <button type="button">
                  <img src={closeBtn} alt="팝업 닫기" onClick={() => setIsOpenEditWalletModal(false)} />
                </button>
              </div>
              <div className="modal__body">
                <InputField
                  id="userWalletAddress"
                  label="My Wallet Address"
                  type="text"
                  placeholder="Please enter your wallet address"
                  defaultValue="2938293829382938292"
                  required
                  value={userWalletEdit}
                  onChange={(e) => setUserWalletEdit(e.target.value)}
                  // 사용자의 지갑 주소가 입력 필드에 자동으로 기입되도록 처리
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${
                    !userWalletEdit || userWalletEdit.trim() === userWallet ? "btn--disabled" : ""
                  } ${isLoading ? "btn--loading" : ""}`}
                  disabled={!userWalletEdit || userWalletEdit.trim() === userWallet}
                  onClick={() => handleSaveWallet(userWalletEdit)}
                >
                  {isLoading ? "Edit Wallet Address" : "Edit Wallet Address"} <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </ModalWrap>
      )}
    </>
  );
}

export default Dashboard;
