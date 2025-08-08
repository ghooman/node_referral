import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// compomnents
import HeaderBack from "../components/unit/HeaderBack";
import Footer from "../components/unit/Footer";
import InputField from "../components/unit/InputField";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";

// img
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../assets/images/icon-arrow-up.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";

// style
import "../components/dashboard/ReferralEarnings.scss";

import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function ReferralEarningList() {
  const userToken = localStorage.getItem("userToken");
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleToggle = (callback) => {
    setOpenIndex(typeof callback === "function" ? callback : callback);
  };

  //----- 하위 레퍼럴 활동현황 상태 ----------------------------------------------------
  const [downReferralActive, setDownReferralActive] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterState, setFilterState] = useState("all"); // all | success | failed
  const [openIndex, setOpenIndex] = useState(null);
  const [activeSettleStatus, setActiveSettleStatus] = useState(null);
  const [selectOpen, setSelectOpen] = useState(false);

  // 상단 4개
  const [downRevenue, setDownRevenue] = useState(0);
  const [downSettlement, setDownSettlement] = useState(0);
  const [downReferrals, setDownReferrals] = useState(0);
  const [downSoldNode, setDownSoldNode] = useState(0);

  // 필터 정렬 상태
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dummyDataList = [
    {
      state: "requested", // ← 문자열
      unit_price: 100,
      cnt: 10,
      my_settlement_amount: 30,
      amount: 20,
      referrals: [
        {
          id: 0,
          username: "ref1@metapol.io",
          share: 30,
          settlement_amount: 300,
          is_complt: true, // ← 불리언
          settlement_dt: "2025-07-23T07:20:00.000Z",
        },
        {
          id: 1,
          username: "ref2@metapol.io",
          share: 20,
          settlement_amount: 200,
          is_complt: false, // ← 불리언
          settlement_dt: "2025-07-23T07:25:00.000Z",
        },
      ],
    },
    {
      state: "cancelled", // ← 문자열
      unit_price: 100,
      cnt: 10,
      my_settlement_amount: 30,
      amount: 20,
      referrals: [
        {
          id: 0,
          username: "ref3@metapol.io",
          share: 50,
          settlement_amount: 1500,
          is_complt: true,
          settlement_dt: "2025-07-22T18:30:00.000Z",
        },
      ],
    },
  ];

  // 상단 4개
  const handleDownDashboard = async () => {
    try {
      const res = await axios.get(
        `${serverAPI}/api/sales/referrals/income/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const list = res.data;
      console.log("하위자 레퍼럴 상단 대시보드 가져오기 완료~!", list);
      setDownRevenue(list.downline_sales_revenue);
      setDownSettlement(list.downline_settlement);
      setDownReferrals(list.downline_referrals);
      setDownSoldNode(list.downline_sold_nodes);
    } catch (error) {
      console.error("하위자 레퍼럴 상단 대시보드 error입니당", error);
    }
  };

  //----- 하위 레퍼럴 활동현황 ----------------------------------------------------
  const handleDownReferralActiveList = async () => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(
        `${serverAPI}/api/sales/referrals/income/list`,
        {
          params: {
            page: currentPage,
            limit: 20,
            state: selectedStatus === "all" ? undefined : selectedStatus,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const list = res.data.data_list;
      const totalCount = res.data.total_cnt || list.length;

      setDownReferralActive(list);
      setTotalCnt(totalCount);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error("하위 레퍼럴 활동현황 error입니당", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    handleDownReferralActiveList();
  }, [currentPage, filterState, selectedStatus]);

  useEffect(() => {
    handleDownDashboard();
    handleDownReferralActiveList();
  }, []);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleFilterSelect = (value) => {
    let stateValue = "all";
    if (value === "정산완료") stateValue = "success";
    else if (value === "정산실패") stateValue = "failed";

    setFilterState(stateValue);
    setCurrentPage(1);
    setSelectOpen(false);
  };

  // 필터 정렬 함수
  const handleStatusFilter = (value) => {
    if (selectedStatus === value) return; // 이미 선택된 상태면 무시
    setSelectedStatus(value);
    setCurrentPage(1); // 필터 바뀌면 1페이지부터 보기
  };

  // 필터 정렬 함수 테스트용
  const getFilteredDummyData = () => {
    if (selectedStatus === "all") return dummyDataList;
    return dummyDataList.filter((item) => item.state === selectedStatus);
  };

  const getFilteredRealData = () => {
    if (!Array.isArray(downReferralActive)) return [];
    if (selectedStatus === "all") return downReferralActive;
    return downReferralActive.filter((item) => item.state === selectedStatus);
  };

  const mapReferralListWithStatus = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
      settleStatusType: item.is_complt ? "success" : "failed",
    }));
  };

  const dummyData = mapReferralListWithStatus(getFilteredDummyData());
  const realData = mapReferralListWithStatus(getFilteredRealData());
  const safeRealData = Array.isArray(realData) ? realData : [];

  const getStateLabel = (state) => {
    const map = {
      requested: "승인요청",
      pending: "승인대기",
      cancelled: "승인취소",
      approved: "승인완료",
      settlement_pending: "정산대기",
      settled: "정산완료",
    };
    return map[state] || state;
  };

  const statusMap = {
    all: "전체",
    requested: "승인요청",
    pending: "승인대기",
    cancelled: "승인취소",
    approved: "승인완료",
    settlement_pending: "정산대기",
    settled: "정산완료",
  };

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString("en-US"); // "1,000", "50,000" 형태
  };

  return (
    <>
      <div className="layout">
        <HeaderBack />
        <div className="page-wrapper padding-del">
          <div className="sales-section">
            <div className="sales-section__record-tit">
              <h2>하위자 수입 리스트 전체보기</h2>
              <span>
                총 <small>{totalCnt}</small>건
              </span>
            </div>
            {/* 임시 요약 데이터 */}
            <ul className="sales-section__record-list referral-record-list">
              <li>
                <h3>하위자 활동 수입</h3>
                <p>{formatNumber(downRevenue)}</p>
              </li>
              <li>
                <h3>하위자 활동 정산금</h3>
                <p>{formatNumber(downSettlement)}</p>
              </li>
              <li>
                <h3>하위자 Affiliate 추천인</h3>
                <p>{formatNumber(downReferrals)}</p>
              </li>
              <li>
                <h3>하위자 Referral 추천인</h3>
                <p>{formatNumber(downSoldNode)}</p>
              </li>
            </ul>
          </div>

          {/* 필터 영역 */}
          <div className="filter-group">
            <div className="filter-group__title">필터링</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="custom-select__btn"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <span>{statusMap[selectedStatus]}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {Object.entries(statusMap).map(([key, label]) => (
                  <li
                    key={key}
                    className={selectedStatus === key ? "is-selected" : ""}
                    onClick={() => {
                      setSelectedStatus(key);
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
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
                    <div className="col">상태</div>
                    <div className="col">객단가</div>
                    <div className="col">개수</div>
                    <div className="col">총금액</div>
                    <div className="col">내 정산금</div>
                    <div className="col col--btn"></div>
                  </div>

                  {/*  하위 판매자가 없는 경우 */}
                  {safeRealData.length === 0 ? (
                    <div className="table-empty">
                      하위자의 판매 기록이 없습니다.
                    </div>
                  ) : (
                    safeRealData.map((item, index) => (
                      <div
                        key={item.state}
                        className={`list-item ${
                          openIndex === index ? "open" : ""
                        }`}
                      >
                        <div className="list-item__row">
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
                            {formatNumber(item.my_settlement_amount)}
                          </div>

                          <div
                            className="col col--btn toggle-btn-box"
                            style={{ width: "15px", height: "20px" }}
                          >
                            <button
                              className={`toggle-btn ${
                                openIndex === index ? "rotate" : ""
                              }`}
                              onClick={() => toggle(index)}
                            >
                              <img src={arrowDownIcon} alt="토글" />
                            </button>
                          </div>
                        </div>

                        {openIndex === index && (
                          <div className="list-item__detail">
                            <div className="info-table">
                              <div className="info-header">
                                <div className="col col--email">
                                  이메일 주소
                                </div>
                                <div className="col">지분</div>
                                <div className="col">정산금</div>
                                <div className="col">정산상태</div>
                              </div>

                          {item.referrals.map((user, i) => (
                            <div className="info-row" key={i}>
                              <div className="col col--email">
                                {i === 0 ? (
                                  <strong>{user.username}</strong>
                                ) : (
                                  <>
                                    <Link to={`/affiliate/other-sales-record?email=${user.username}`}>
                                      <span>{user.username}</span>
                                      <img src={arrowRightIcon} alt="자세히 보기" className="arrow-icon" />
                                    </Link>
                                  </>
                                )}
                              </div>
                              <div className="col">{user.share}</div>
                              <div className="col">{user.settlement_amount}</div>
                              <div className="col">
                                <span className={`status ${user.is_complt ? "status--success" : "status--failed"}`}>
                                  {user.is_complt ? "완료" : "대기"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
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

export default ReferralEarningList;
