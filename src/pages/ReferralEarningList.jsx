import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";

// img
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";

// style
import "../components/dashboard/ReferralEarnings.scss";

import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function ReferralEarningList() {
  const userToken = localStorage.getItem("userToken");
  //----- 상태 ------------------------------------------------------------------------------------
  // 상단 대시보드
  const [downRevenue, setDownRevenue] = useState(0);
  const [downSettlement, setDownSettlement] = useState(0);
  const [downReferrals, setDownReferrals] = useState(0);
  const [downSoldNode, setDownSoldNode] = useState(0);

  // 하위 레퍼럴 활동현황 상태
  const [downReferralActive, setDownReferralActive] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);

  // 필터 정렬 상태
  // 어떤 항목을 선택했는지(라벨 표시용)
  const [selectedKey, setSelectedKey] = useState("status:all");

  // 실제 API 파라미터용
  const [statusFilter, setStatusFilter] = useState("all"); // status 파라미터
  const [sortFilter, setSortFilter] = useState(null); // sort 파라미터(normal | referral)

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  // 상단 대시보드 가져오는 함수
  const handleDownDashboard = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/referrals/income/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
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

  // 하단 리스트 가져오는 함수
  const handleDownReferralActiveList = async () => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(`${serverAPI}/api/sales/referrals/income/list`, {
        params: {
          page: currentPage,
          limit: 20,
          state: statusFilter === "all" ? undefined : statusFilter,
          sort: sortFilter || undefined, // normal | referral
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const list = res.data.data_list;
      const totalCount = res.data.total_cnt || list.length;
      console.log("하위 레퍼럴 활동현황 받아오기 완료!", res.data);

      setDownReferralActive(list);
      setTotalCnt(res.data.total_cnt);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error("하위 레퍼럴 활동현황 error입니당", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
  // 우측 화살표 토글
  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  //----- useEffect 모음  ------------------------------------------------------------------------------------
  useEffect(() => {
    handleDownReferralActiveList();
  }, [currentPage, statusFilter, sortFilter]);

  useEffect(() => {
    handleDownDashboard();
    handleDownReferralActiveList();
  }, []);

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper padding-del">
          <div className="sales-section">
            <div className="sales-section__record-tit">
              <h2>Sub-Affiliate Earnings List</h2>
              <span>
                Total <small>{totalCnt}</small>
              </span>
            </div>
            {/* 임시 요약 데이터 */}
            <ul className="sales-section__record-list referral-record-list">
              <li>
                <h3>Sub-affiliate Sales Revenue</h3>
                <p>{downRevenue}</p>
              </li>
              <li>
                <h3>Sub-affiliate Settlements</h3>
                <p>{downSettlement}</p>
              </li>
              <li>
                <h3>Sub-affiliate Referrals</h3>
                <p>{downReferrals}</p>
              </li>
              <li>
                <h3>Sub-affiliate Sold Nodes</h3>
                <p>{downSoldNode}</p>
              </li>
            </ul>
          </div>

          {/* 필터 영역 */}
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button type="button" className="custom-select__btn" onClick={() => setIsFilterOpen((prev) => !prev)}>
                <span>{FILTER_SORT_OPTIONS.find((o) => o.key === selectedKey)?.label || "All"}</span>
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
              {isPageLoading ? (
                <div className="result-loading">
                  <Loading />
                </div>
              ) : (
                <>
                  <div className="table-section__tit__list-head">
                    <div className="col">Transaction Type</div>
                    <div className="col">Status</div>
                    <div className="col">Unit Price</div>
                    <div className="col">Quantity</div>
                    <div className="col">Total Amount</div>
                    <div className="col">My Settlement Amount</div>
                  </div>

                  {/*  하위 판매자가 없는 경우 */}
                  {totalCnt === 0 ? (
                    <div className="table-empty">No sub-referral sales records.</div>
                  ) : (
                    downReferralActive.map((item, index) => (
                      <div
                        key={item.id ?? `${item.state}-${index}`}
                        className={`list-item ${openIndex === index ? "open" : ""}`}
                      >
                        <div className="list-item__row">
                          <div className="col">
                            <span className={`status status--${item.sort}`}>{getStateLabel(item.sort)}</span>
                          </div>
                          <div className="col">
                            <span className={`status status--${item.state}`}>{getStateLabel(item.state)}</span>
                          </div>
                          <div className="col">{item.unit_price}</div>
                          <div className="col">{item.cnt}</div>
                          <div className="col">{item.amount}</div>
                          <div className="col col--btn toggle-btn-box" style={{ width: "15px", height: "20px" }}>
                            {item.my_settlement_amount}
                            <button
                              className={`toggle-btn ${openIndex === index ? "rotate" : ""}`}
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
                                <div className="col col--email">Email Address</div>
                                <div className="col">Share</div>
                                <div className="col">Settlement Amount</div>
                                <div className="col">Settlement Status</div>
                              </div>

                              {(item.down_referrals || item.referrals || []).map((user, i) => (
                                <div className="info-row" key={i}>
                                  <div className="col col--email">
                                    {i === 0 ? (
                                      <strong>{user.username}</strong>
                                    ) : (
                                      <>
                                        <Link to={`/other-sales-record?email=${user.username}`}>
                                          <span>{user.username}</span>
                                          <img src={arrowRightIcon} alt="자세히 보기" className="arrow-icon" />
                                        </Link>
                                      </>
                                    )}
                                  </div>
                                  <div className="col">{user.share}%</div>
                                  <div className="col">{user.settlement_amount}</div>
                                  <div className="col">
                                    <span className={`status ${user.is_complt ? "status--success" : "status--failed"}`}>
                                      {user.is_complt ? "Completed" : "Pending"}
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

export default ReferralEarningList;
