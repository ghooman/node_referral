import React, { useState, useEffect } from "react";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading.jsx";

// style
import "../styles/pages/ReferralEarningList.scss";
import "../components/dashboard/ReferralEarnings.scss";
import "../styles/pages/OtherSalesRecord.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function OtherSalesRecord() {
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();

  //----- 상태 ------------------------------------------------------------------------------------
  // 상단 대시보드 상태
  const [subUserDashboard, setSubUserDashboard] = useState({
    sales_revenue: 0,
    settlement: 0,
    sold_nodes: 0,
    referrals: 0,
    referral_code_user: 0,
  });

  // 하단 리스트 상태
  const [subUserData, setSubUserData] = useState({
    total_cnt: 0,
    data_list: [],
  });

  const [userEmail, setUserEmail] = useState("");

  // 정렬 필터 버튼
  // 어떤 항목을 선택했는지(라벨 표시용)
  const [selectedKey, setSelectedKey] = useState("status:all");

  // 실제 API 파라미터용
  const [statusFilter, setStatusFilter] = useState("all"); // status 파라미터
  const [sortFilter, setSortFilter] = useState(null); // sort 파라미터(normal | referral)

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);

  const [isPageLoading, setIsPageLoading] = useState(false);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  //----- 필터 제어 ------------------------------------------------------------------------------------
  // 필터 드롭다운 순서
  const FILTER_SORT_OPTIONS = [
    { key: "status:all", label: "All" },
    // sort 계열
    { key: "sort:normal", label: "Affiliate" },
    { key: "sort:referral", label: "User" },
    // status 계열
    { key: "status:requested", label: "Requested" },
    { key: "status:pending", label: "Pending" },
    { key: "status:approved", label: "Approved" },
    { key: "status:cancelled", label: "Cancelled" },
    { key: "status:승인완료", label: "Settlement" },
    { key: "status:settled", label: "Settled" },
  ];

  // 필터 라벨링
  const getStateLabel = (state) => {
    const map = {
      all: "All",
      normal: "Affiliate",
      referral: "User",
      requested: "Requested",
      pending: "Pending",
      approved: "Approved",
      cancelled: "Cancelled",
      승인완료: "Settlement",
      settled: "Settled",
    };
    return map[state] || state;
  };

  // 필터 제어
  const handleFilterSelectUnified = (key) => {
    setSelectedKey(key);
    const [type, value] = key.split(":");

    if (key === "status:all") {
      setStatusFilter("all");
      setSortFilter(null); // ✅ 완전 초기화
    } else if (type === "status") {
      setStatusFilter(value); // 이번에 고른 status를 적용
      setSortFilter(null); // ✅ sort는 초기화
    } else if (type === "sort") {
      setSortFilter(value); // 이번에 고른 sort를 적용
      setStatusFilter("all"); // ✅ status는 'all'로 초기화
    }

    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  //----- API 호출 함수  ------------------------------------------------------------------------------------
  // 상단 4개
  const handleSubUserDashboard = async () => {
    try {
      const res = await axios.get(
        `${serverAPI}/api/sales/user/income/dashboard`,
        {
          params: {
            username: userEmail,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
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
          state: statusFilter === "all" ? undefined : statusFilter,
          sort: sortFilter || undefined, // normal | referral
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

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
  // 날짜 포맷팅
  // 날짜 포맷팅
  const formatDate = (isoString) => {
    if (!isoString) return "-";
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

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString("en-US"); // "1,000", "50,000" 형태
  };

  //----- useEffect 모음  ------------------------------------------------------------------------------------
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
  }, [userEmail, statusFilter, sortFilter, currentPage]);

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper">
          <div className="sales-section">
            <div className="sales-section__record-tit other-section">
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
                <h3>Invites</h3>
                <p>{formatNumber(subUserDashboard.referrals)}</p>
              </li>
              <li>
                <h3>Number of Sales Nodes</h3>
                <p>{formatNumber(subUserDashboard.sold_nodes)}</p>
              </li>
              <li>
                <h3>Referrals</h3>
                <p>{formatNumber(subUserDashboard.referral_code_user)}</p>
              </li>
            </ul>
          </div>
          {/* 필터 영역 */}
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="custom-select__btn"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <span>
                  {FILTER_SORT_OPTIONS.find((o) => o.key === selectedKey)
                    ?.label || "All"}
                </span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {FILTER_SORT_OPTIONS.map((opt) => (
                  <li
                    key={opt.key}
                    className={selectedKey === opt.key ? "is-selected" : ""}
                    onClick={() => handleFilterSelectUnified(opt.key)}
                  >
                    {opt.label}
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
                    <div className="col">Transaction Type</div>
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
                      <div
                        key={item.id}
                        className={`list-item ${
                          openIndex === index ? "open" : ""
                        }`}
                      >
                        <div className="list-item__row">
                          <div className="col">
                            <span className={`status status--${item.sort}`}>
                              {getStateLabel(item.sort)}
                            </span>
                          </div>
                          <div className="col">
                            <span className={`status status--${item.state}`}>
                              {getStateLabel(item.state)}
                            </span>
                          </div>
                          <div className="col">
                            {formatNumber(item.unit_price)}
                          </div>
                          <div className="col">{formatNumber(item.cnt)}</div>
                          <div className="col">{formatNumber(item.amount)}</div>
                          <div className="col">
                            {formatNumber(item.settlement_amount)}
                          </div>
                          <div className="col">
                            {formatDate(item.create_dt)}
                          </div>
                          <div className="col">{item.buyer_name}</div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default OtherSalesRecord;
