import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// compomnents
import Header from "../components/unit/HeaderBack";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading.jsx";

// img
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../assets/images/icon-arrow-up.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";

// style
import "../styles/pages/ReferralEarningList.scss";
import "../components/dashboard/ReferralEarnings.scss";
import "../styles/pages/OtherSalesRecord.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function OtherSalesRecord() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);
  const [activeSettleStatus, setActiveSettleStatus] = useState(null);
  const userToken = localStorage.getItem("userToken");

  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [subUserDashboard, setSubUserDashboard] = useState([]);
  // 수정 후 ✅
  const [subUserData, setSubUserData] = useState({
    total_cnt: 0,
    data_list: [],
  });

  // 정렬 필터 버튼
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all"); // 버튼에 보여줄 텍스트
  const [isCompltParam, setIsCompltParam] = useState(null); // true/false/null → API 요청용

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const handleToggle = (callback) => {
    setOpenIndex(typeof callback === "function" ? callback : callback);
  };
  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setUserEmail(emailFromUrl);
      console.log("이메일 기반 유저 데이터 로드:", emailFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (userEmail) {
      // 필터링 또는 API 호출 로직
      console.log("이메일 기반 유저 데이터 로드:", userEmail);
      handleSubUserDashboard();
      handleSubUserData();
    }
  }, [userEmail, selectedStatus, currentPage]);

  // 상단 4개
  const handleSubUserDashboard = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/user/income/dashboard`, {
        params: {
          username: userEmail,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const list = res.data;
      console.log("하위 레퍼럴 상단 대시보드 가져왔당", list);
      setSubUserDashboard(list);
    } catch (error) {
      console.error("하위 레퍼럴 상단 대시보드 가져오는거 error", error);
    }
  };

  // 필터랑 리스트
  const handleSubUserData = async () => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(`${serverAPI}/api/sales/user/income/list`, {
        params: {
          username: userEmail,
          page: currentPage,
          limit: 20,
          state: selectedStatus !== "all" ? selectedStatus : undefined,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const list = res.data;
      console.log("하위 레퍼럴 하단 리스트 정보 가져왔당", list);

      const totalCnt = res.data?.total_cnt || 0;
      setTotalCount(totalCnt);
      setTotalPages(Math.ceil(totalCnt / 20)); // ✅ 총 페이지 수 계산

      setSubUserData({
        ...res.data,
        data_list: res.data.data_list.map((item) => ({
          ...item,
          settleStatusType: item.is_complt ? "success" : "failed",
        })),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleFilterChange = (key) => {
    setSelectedStatus(key); // key는 영문값 (예: "requested")
    setIsFilterOpen(false);
    setCurrentPage(1);
    setIsCompltParam(null); // state 기반 필터링을 별도로 보낼 거라면 isCompltParam은 유지 or 제거 필요
  };

  // 날짜 포맷팅
  const formatDate = (isoString) => {
    const raw = new Date(isoString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // "2025. 07. 19. 15:16" → "2025. 07. 19 15:16"
    return raw.replace(/(\d{2})\.\s(\d{2})\.\s(\d{2})\.\s/, "$1. $2. $3 ");
  };

  const getKoreanState = (state) => {
    const stateMap = {
      all: "All",
      requested: "Requested",
      pending: "Pending",
      approved: "Approved",
      cancelled: "Cancelled",
      승인완료: "Settlement",
      settled: "Settled",
    };
    return stateMap[state] || state;
  };

  const statusMap = {
    all: "All",
    requested: "Requested",
    pending: "Pending",
    approved: "Approved",
    cancelled: "Cancelled",
    승인완료: "Settlement",
    settled: "Settled",
  };

  const getBadgeClassName = (state) => {
    return state; // 상태명이 곧 className과 동일함
  };

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString("en-US"); // "1,000", "50,000" 형태
  };

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper padding-del">
          <div className="sales-section">
            <div className="sales-section__record-tit">
              <div className="custom-select">
                {/* custom-select에 is-open class 삽입 시 select option 노출 */}
                <div className="custom-select__sales-list">
                  <button type="button" className="custom-select__btn">
                    <span>{userEmail}</span>
                    {/* <i className="custom-select__arrow"></i> */}
                  </button>
                  <small>’s Sales Records</small>
                </div>
                {/* <ul className="custom-select__list">
                  <li className="is-selected">kimchumzi@nisoft.kr</li>
                  <li>kimchumzi@nisoft.kr</li>
                </ul> */}
              </div>
              <span>
                Total <small>{subUserData.total_cnt}</small>
              </span>
            </div>
            <ul className="sales-section__record-list referral-record-list">
              <li>
                <h3>Sales Income</h3>
                <p>{formatNumber(subUserDashboard.sales_revenue)}</p>
              </li>
              <li>
                <h3>Sales Settlement Amount</h3>
                <p>{formatNumber(subUserDashboard.settlement)}</p>
              </li>
              <li>
                <h3>Referrers</h3>
                <p>{formatNumber(subUserDashboard.referrals)}</p>
              </li>
              <li>
                <h3>Number of Sales Nodes</h3>
                <p>{formatNumber(subUserDashboard.sold_nodes)}</p>
              </li>
            </ul>
          </div>
          {/* 필터 영역 */}
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button type="button" className="custom-select__btn" onClick={() => setIsFilterOpen((prev) => !prev)}>
                <span>{statusMap[selectedStatus]}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {Object.entries(statusMap).map(([key, label]) => (
                  <li
                    key={key}
                    className={selectedStatus === key ? "is-selected" : ""}
                    onClick={() => handleFilterChange(key)}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <section className="table-section">
            <div className="table-section-inner">
              {isPageLoading && (
                <div className="result-loading">
                  <Loading />
                </div>
              )}

              {!isPageLoading && (
                <>
                  <div className="table-section__tit__list-head">
                    <div className="col">Status</div>
                    <div className="col">Unit Price</div>
                    <div className="col">Quantity</div>
                    <div className="col">Total Amount</div>
                    <div className="col">Settlement Amount</div>
                    <div className="col">Registration Date</div>
                    <div className="col">Buyer</div>
                  </div>

                  {/*  하위 판매자가 없는 경우 */}
                  {subUserData.data_list.length === 0 ? (
                    <div className="table-empty">No sales records.</div>
                  ) : (
                    subUserData.data_list.map((item, index) => (
                      <div key={item.id} className={`list-item ${openIndex === index ? "open" : ""}`}>
                        <div className="list-item__row">
                          <div className="col">
                            <span className={`status status--${item.state}`}>{getKoreanState(item.state)}</span>
                          </div>
                          <div className="col">{formatNumber(item.unit_price)}</div>
                          <div className="col">{formatNumber(item.cnt)}</div>
                          <div className="col">{formatNumber(item.amount)}</div>
                          <div className="col">{formatNumber(item.settlement_amount)}</div>
                          <div className="col">{formatDate(item.create_dt)}</div>
                          <div className="col">{item.buyer_name}</div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </section>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default OtherSalesRecord;
