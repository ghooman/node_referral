import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import CopyButton from "../components/unit/CopyButton";
import TwowayConfirmModal from "../components/modal/TwowayConfirmModal";
import Loading from "../../src/components/Loading.jsx";
// img
import SearchIcon from "../assets/images/icon-search.svg";
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";
// style
import "../styles/pages/MasterDashboard.scss";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function MasterDashboardDoing() {
  const userToken = localStorage.getItem("userToken");
  //----- 상태 ------------------------------------------------------------------------------------
  // 상단 대시보드 상태
  const [dashboard, setDashboard] = useState([]);
  // 하단 리스트 상태
  const [dataList, setDataList] = useState([]);

  // 필터 정렬 상태
  // 어떤 항목을 선택했는지(라벨 표시용)
  const [selectedKey, setSelectedKey] = useState("status:all");
  // 실제 API 파라미터용
  const [statusFilter, setStatusFilter] = useState("all"); // status 파라미터
  const [sortFilter, setSortFilter] = useState(null); // sort 파라미터(normal | referral)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 검색창
  const [searchKeyword, setSearchKeyword] = useState("");

  // 취소 버튼 클릭 모달
  const [confirmModalOpenId, setConfirmModalOpenId] = useState(null);
  // 승인 상태 업데이트
  const [isStateChanged, setIsStateChanged] = useState(false);
  // 정산 상태 업데이트
  const [isSettlementChanged, setIsSettlementChanged] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);

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
  // 상단 대시보드 API 함수
  const handleGetDashboard = async () => {
    try {
      const res = await axios.get(
        `${serverAPI}/api/sales/record/approval/settlement/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("상단 대시보드 가져오기 완료!", res.data);
      setDashboard(res.data);
    } catch (error) {
      console.error("상단 대시보드 가져오는 API 함수 error입니당", error);
    }
  };

  // 하단 리스트 API 함수
  const handleGetDataList = async () => {
    console.log("🔍 서버로 보내는 state", statusFilter, sortFilter);
    console.log("🔍 서버로 보내는 search_keyword", searchKeyword);

    try {
      setIsLoading(true);

      const res = await axios.get(
        `${serverAPI}/api/sales/record/approval/settlement/list`,
        {
          params: {
            state: statusFilter === "all" ? undefined : statusFilter,
            sort: sortFilter || undefined, // normal | referral
            page: currentPage,
            limit: 20,
            search_keyword: searchKeyword !== "" ? searchKeyword : undefined,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const list = res.data.data_list;
      const totalCount = res.data.total_cnt || list.length;

      console.log("하단 리스트 가져오기 완료!", res.data);

      setDataList(list);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error("하단 리스트 가져오는 API 함수 error입니당", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 승인 / 취소 버튼 클릭했을 때
  const handleChangeState = async (salesId, newState) => {
    try {
      const res = await axios.post(
        `${serverAPI}/api/sales/${salesId}/state`,
        null,
        {
          params: { state: newState },
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log("상태 변경 성공:", res.data.status);
      setIsStateChanged(true); // useEffect 트리거
    } catch (error) {
      console.error(`상태 '${newState}' 변경 실패:`, error);
    }
  };

  // 정산 버튼 클릭했을 때
  const handleSettlement = async (settlement_id) => {
    console.log("🟢 정산 버튼 클릭됨 - settlement_id:", settlement_id); // ← 여기!
    try {
      const res = await axios.post(
        `${serverAPI}/api/sales/${settlement_id}/settlement`,
        null,
        {
          // params: {
          //   settlement_id: settlement_id,
          // },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("정산 버튼 클릭 성공:", res.data.status);
      setIsSettlementChanged(true);
    } catch (error) {
      console.error("정산 버튼 클릭 오류입니당", error);
    }
  };

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
  // 우측 화살표 토글
  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

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

  // 지갑 주소 포맷팅 함수 (앞뒤 4글자씩 짜르기 0x00....0000)
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString("en-US"); // "1,000", "50,000" 형태
  };

  // Action 보조 함수들
  const getApprovalOrCancelBlock = (item) => {
    // 취소된 건
    if (item.approval_cancel_dt) {
      return (
        <div className="toway-txt-box --cancelled">
          <p>{getStateLabel("cancelled")}</p>
          <small>{formatDate(item.approval_cancel_dt)}</small>
        </div>
      );
    }

    // 승인된 건
    if (item.approval_dt) {
      return (
        <div className="toway-txt-box --approved">
          <p>{getStateLabel("approved")}</p>
          <small>{formatDate(item.approval_dt)}</small>
        </div>
      );
    }

    return null;
  };

  //----- useEffect 모음  ------------------------------------------------------------------------------------
  // 대시보드는 처음 한 번만 실행
  useEffect(() => {
    if (userToken) {
      handleGetDashboard();
    }
  }, []);

  // 하단 리스트는 값 바뀔때마다 실행
  useEffect(() => {
    if (userToken) {
      handleGetDataList();
    }
  }, [statusFilter, sortFilter, currentPage]);

  // 승인 상태 업데이트
  useEffect(() => {
    if (isStateChanged) {
      handleGetDataList();
      setIsStateChanged(false); // 초기화
    }
  }, [isStateChanged]);

  useEffect(() => {
    if (isSettlementChanged) {
      handleGetDataList();
      setIsSettlementChanged(false); // 다시 false로 초기화
    }
  }, [isSettlementChanged]);

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper masterdashboard-wrapper">
          <ul className="tab-ui">
            <li className="selected">
              <Link to="/master-dashboard-doing">
                Sales Approval / Settlement
              </Link>
            </li>
            <li>
              <Link to="/master-dashboard-done">Settlement History</Link>
            </li>
          </ul>

          {/* 대시보드 */}
          <section className="dash-section">
            <h2 className="dash-section__tit">Dashboard</h2>
            <div className="dash-section__txt">
              <ul className="dash-section__txt__board">
                <li>
                  <h3>Total</h3>
                  <p>{formatNumber(dashboard.sales_record)}</p>
                </li>
                <li>
                  <h3>Settled</h3>
                  <p>{formatNumber(dashboard.settled)}</p>
                </li>
                <li>
                  <h3>Settlement</h3>
                  <p>{formatNumber(dashboard.settlement_pending)}</p>
                </li>
                <li>
                  <h3>Approved</h3>
                  <p>{formatNumber(dashboard.approved)}</p>
                </li>
                <li>
                  <h3>Cancelled</h3>
                  <p>{formatNumber(dashboard.cancelled)}</p>
                </li>
                <li>
                  <h3>Pending</h3>
                  <p>{formatNumber(dashboard.pending)}</p>
                </li>
              </ul>
            </div>
          </section>
          <div className="filter-section">
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
            <div className="node-search-bar">
              <input
                type="text"
                placeholder="Search by Email or Wallet Address"
                className="node-search-bar__input"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1); // 페이지 초기화
                    handleGetDataList(); // 검색 즉시 실행
                  }
                }}
              />
              <button
                type="button"
                className="node-search-bar__btn"
                onClick={() => {
                  setCurrentPage(1);
                  handleGetDataList();
                }}
              >
                <img
                  src={SearchIcon}
                  alt="검색"
                  aria-hidden="true"
                  className="icon-search"
                />
                <span className="sr-only">검색</span>
              </button>
            </div>
          </div>
          <div className="table-section">
            <div className="table-section-inner">
              {isLoading && (
                <div className="result-loading">
                  <Loading />
                </div>
              )}

              {!isLoading && (
                <>
                  {/* table head */}
                  <div className="table-section__tit__list-head">
                    <div className="col" style={{ flex: "0 0 10%" }}>
                      Transaction Type
                    </div>
                    <div className="col" style={{ flex: "0 0 10%" }}>
                      Status
                    </div>
                    <div className="col" style={{ flex: "0 0 15%" }}>
                      Deposited Wallet Address
                    </div>
                    <div className="col" style={{ flex: "0 0 10%" }}>
                      Unit Price
                    </div>
                    <div className="col" style={{ flex: "0 0 10%" }}>
                      Quantity
                    </div>
                    <div className="col" style={{ flex: "0 0 10%" }}>
                      Total Amount
                    </div>
                    <div className="col" style={{ flex: "0 0 15%" }}>
                      Wallet to Send
                    </div>
                    <div className="col">Action</div>
                  </div>
                  {!isLoading && dataList.length === 0 ? (
                    <div className="table-empty">
                      No matching records found.
                    </div>
                  ) : (
                    dataList.map((item, index) => (
                      <div
                        key={item.id ?? `${item.state}-${index}`}
                        className={`list-item ${
                          openIndex === index ? "open" : ""
                        }`}
                      >
                        <div className="list-item__row">
                          <div className="col" style={{ flex: "0 0 10%" }}>
                            <span className={`status status--${item.sort}`}>
                              {getStateLabel(item.sort)}
                            </span>
                          </div>
                          <div className="col" style={{ flex: "0 0 10%" }}>
                            <span className={`status status--${item.state}`}>
                              {getStateLabel(item.state)}
                            </span>
                          </div>

                          <div
                            className="col wallet-copy-com"
                            style={{ flex: "0 0 15%" }}
                          >
                            {formatWalletAddress(item.deposit_wallet_address)}
                            <CopyButton
                              textToCopy={item.deposit_wallet_address}
                            />
                          </div>
                          <div className="col" style={{ flex: "0 0 10%" }}>
                            {formatNumber(item.unit_price)}
                          </div>
                          <div className="col" style={{ flex: "0 0 10%" }}>
                            {formatNumber(item.cnt)}
                          </div>
                          <div className="col" style={{ flex: "0 0 10%" }}>
                            {formatNumber(item.amount)}
                          </div>
                          <div
                            className="col wallet-copy-com"
                            style={{ flex: "0 0 15%" }}
                          >
                            {formatWalletAddress(item.buyer_wallet_address)}
                            <CopyButton
                              textToCopy={item.buyer_wallet_address}
                            />
                          </div>
                          <div className="col col--action toggle-btn-box">
                            {/* 1) 승인/취소 버튼 (pending일 때만) */}
                            {item.state === "pending" ? (
                              <div className="twoway-btn-box --pending">
                                <button
                                  className="twoway-btn btn--blue"
                                  onClick={() => {
                                    console.log(
                                      "🟢 승인 클릭됨 - item.id:",
                                      item.id
                                    );
                                    handleChangeState(item.id, "approved");
                                  }}
                                >
                                  Approval
                                </button>
                                <button
                                  className="twoway-btn btn--red"
                                  onClick={() => setConfirmModalOpenId(item.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              /* 2) 버튼이 아닌 상태(approved/cancelled/settlement* 등)에서는
                            - 승인/취소 블록은 항상 보이게
                            - 정산 완료일은 추가로 쌓아서 보이게  */
                              <div className="status-stack">
                                {/* 승인/취소 정보는 상태와 무관하게 유지 */}
                                {getApprovalOrCancelBlock(item)}
                              </div>
                            )}

                            {/* 토글 버튼은 항상 우측에 유지 */}
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
                        {/* table body detail */}
                        {openIndex === index && (
                          <div className="list-item__detail">
                            <div className="info-table">
                              <div className="info-header">
                                <div
                                  className="col col--email"
                                  style={{ flex: "0 0 20%" }}
                                >
                                  Email Address
                                </div>
                                <div
                                  className="col"
                                  style={{ flex: "0 0 10%" }}
                                >
                                  Share
                                </div>
                                <div
                                  className="col"
                                  style={{ flex: "0 0 30%" }}
                                >
                                  Settlement Amount
                                </div>
                                <div
                                  className="col"
                                  style={{ flex: "0 0 20%" }}
                                >
                                  Wallet Address
                                </div>
                                <div
                                  className="col"
                                  style={{ flex: "0 0 20%" }}
                                >
                                  Settlement Status
                                </div>
                              </div>

                              {item.referrals?.map((user, i) => (
                                <div className="info-row" key={i}>
                                  <div
                                    className="col col--email"
                                    style={{ flex: "0 0 20%" }}
                                  >
                                    <Link
                                      to={`/other-sales-record?email=${user.username}`}
                                    >
                                      <span>{user.username}</span>
                                      <img
                                        src={arrowRightIcon}
                                        alt="자세히 보기"
                                        className="arrow-icon"
                                      />
                                    </Link>
                                  </div>
                                  <div
                                    className="col"
                                    style={{ flex: "0 0 10%" }}
                                  >
                                    {user.share}%
                                  </div>
                                  <div
                                    className="col"
                                    style={{ flex: "0 0 30%" }}
                                  >
                                    {formatNumber(user.settlement_amount)}
                                  </div>
                                  <div
                                    className="col"
                                    style={{ flex: "0 0 20%" }}
                                  >
                                    {formatWalletAddress(user.wallet_address)
                                      ? formatWalletAddress(user.wallet_address)
                                      : "-"}
                                  </div>
                                  <div className="col settlement-btn-box">
                                    {user.is_complt === false ? (
                                      <button
                                        className="btn--blue-line"
                                        onClick={() =>
                                          handleSettlement(user.id)
                                        }
                                        disabled={item.state !== "approved"} // 승인완료 아니면 비활성화
                                      >
                                        Settle
                                      </button>
                                    ) : (
                                      <span>
                                        {formatDate(user.settlement_dt)}
                                      </span>
                                    )}
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
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Footer />
        {/* table-section 내 '취소' 선택 시 Confirm Modal 노출  */}
        {confirmModalOpenId !== null && (
          <TwowayConfirmModal
            title="Are you sure you want to cancel this transaction?"
            message="This will cancel the transaction request."
            confirmText="OK"
            cancelText="Cancel"
            onConfirm={async () => {
              console.log("🔴 취소 클릭됨 - item.id:", confirmModalOpenId);
              await handleChangeState(confirmModalOpenId, "cancelled"); // 취소
              setConfirmModalOpenId(null);
            }}
            onCancel={() => setConfirmModalOpenId(null)}
          />
        )}
      </div>
    </>
  );
}

export default MasterDashboardDoing;
