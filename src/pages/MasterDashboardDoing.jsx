import axios from "axios";
import { Link } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import CopyButton from "../components/unit/CopyButton";
import TwowayConfirmModal from "../components/modal/TwowayConfirmModal";
// img
import SearchIcon from "../assets/images/icon-search.svg";
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";
// style
import "../styles/pages/MasterDashboard.scss";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function MasterDashboardDoing() {
  const userToken = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  const isMaster = userRole === "master";

  // 상단 대시보드 상태
  const [dashboard, setDashboard] = useState([]);
  // 총 갯수 상태
  const [totalCnt, setTotalCnt] = useState(0);
  // 하단 리스트 상태
  const [dataList, setDataList] = useState([]);
  // 정렬 필터 버튼
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all"); // 버튼에 보여줄 텍스트
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

  // 상단 대시보드 API 함수
  const handleGetDashboard = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/record/approval/settlement/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("상단 대시보드 가져오기 완료!", res.data);
      setDashboard(res.data);
    } catch (error) {
      console.error("상단 대시보드 가져오는 API 함수 error입니당", error);
    }
  };

  // 하단 리스트 API 함수
  const handleGetDataList = async () => {
    console.log("🔍 서버로 보내는 state", selectedStatus);
    console.log("🔍 서버로 보내는 search_keyword", searchKeyword);

    try {
      const res = await axios.get(`${serverAPI}/api/sales/record/approval/settlement/list`, {
        params: {
          state: selectedStatus !== "all" ? selectedStatus : undefined,
          page: currentPage,
          limit: 20,
          search_keyword: searchKeyword !== "" ? searchKeyword : undefined,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const rawList = res.data.data_list;
      const allowedStates = ["pending", "cancelled", "approved", "settled"];

      // ✅ all일 경우만 필터 없이 전체, 나머지는 상태 필터링
      const filteredList =
        selectedStatus === "all"
          ? rawList.filter((item) => allowedStates.includes(item.state)) // allowedStates 안에 있는 것만 보여줌
          : rawList;

      setTotalCnt(filteredList.length);
      setDataList(filteredList);
      setTotalPages(Math.ceil(res.data.total_cnt / 20));
    } catch (error) {
      console.error("하단 리스트 가져오는 API 함수 error입니당", error);
    }
  };

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
  const data = [
    {
      status: "승인대기",
      wallet: "0xDdDd...DdDd",
      unitPrice: 500,
      quantity: 1,
      total: 500,
      toWallet: "0xDdDd...DdDd",
      emailList: ["kimchumji@mob.com", "kimchumji@mob.com", "kimchumji@mob.com"],
      정산리스트: [
        {
          email: "kimchumji@mob.com",
          지분: "50%",
          정산금: "250",
          정산상태: "정산대기",
        },
        {
          email: "partner@mob.com",
          지분: "50%",
          정산금: "250",
          정산상태: "정산완료",
        },
      ],
    },
    {
      status: "승인취소",
      wallet: "0xDdDd...DdDd",
      unitPrice: 500,
      quantity: 1,
      total: 500,
      toWallet: "0xDdDd...DdDd",
      emailList: ["kimchumji@mob.com", "kimchumji@mob.com", "kimchumji@mob.com"],
      정산리스트: [
        {
          email: "kimchumji@mob.com",
          지분: "50%",
          정산금: "250",
          정산상태: "정산대기",
        },
        {
          email: "partner@mob.com",
          지분: "50%",
          정산금: "250",
          정산상태: "정산완료",
        },
      ],
    },
  ];

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
  }, [selectedStatus, currentPage, searchKeyword]);

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

  // 영한 변환 함수
  const getKoreanState = (state) => {
    const map = {
      requested: "승인요청",
      pending: "승인대기",
      approved: "승인완료",
      cancelled: "승인취소",
      settlement_pending: "정산대기",
      settled: "정산완료",
    };
    return map[state] || state; // 못 찾으면 그냥 원래 값 반환
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

  // 정렬 필터 매핑
  const statusMap = {
    all: "전체",
    // requested: "승인요청",
    pending: "승인대기",
    cancelled: "승인취소",
    approved: "승인완료",
    // settlement_pending: "정산대기",
    settled: "정산완료",
  };

  // 정렬 필터 변경 함수
  const handleFilterChange = (key) => {
    setSelectedStatus(key);
    setIsFilterOpen(false);
    setCurrentPage(1); // 페이지 초기화
  };

  // 승인 / 취소 버튼 클릭했을 때
  const handleChangeState = async (salesId, newState) => {
    try {
      const res = await axios.post(`${serverAPI}/api/sales/${salesId}/state`, null, {
        params: { state: newState },
        headers: { Authorization: `Bearer ${userToken}` },
      });
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
      const res = await axios.post(`${serverAPI}/api/sales/${settlement_id}/settlement`, null, {
        // params: {
        //   settlement_id: settlement_id,
        // },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("정산 버튼 클릭 성공:", res.data.status);
      setIsSettlementChanged(true);
    } catch (error) {
      console.error("정산 버튼 클릭 오류입니당", error);
    }
  };

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper masterdashboard-wrapper">
          <ul className="tab-ui">
            <li className="selected">
              <Link to="/MasterDashboardDoing">판매승인/정산</Link>
            </li>
            <li>
              <Link to="/MasterDashboardDone">정산기록</Link>
            </li>
          </ul>

          {/* 대시보드 */}
          <section className="dash-section">
            <h2 className="dash-section__tit">Dashboard</h2>
            <div className="dash-section__txt">
              <ul className="dash-section__txt__board">
                <li>
                  <h3>전체 거래건 수</h3>
                  <p>{dashboard.sales_record}</p>
                </li>
                <li>
                  <h3>정산완료</h3>
                  <p>{dashboard.settled}</p>
                </li>
                <li>
                  <h3>정산대기</h3>
                  <p>{dashboard.settlement_pending}</p>
                </li>
                <li>
                  <h3>승인완료</h3>
                  <p>{dashboard.approved}</p>
                </li>
                <li>
                  <h3>승인취소</h3>
                  <p>{dashboard.cancelled}</p>
                </li>
                <li>
                  <h3>승인대기</h3>
                  <p>{dashboard.pending}</p>
                </li>
              </ul>
            </div>
          </section>
          <div className="filter-section">
            {/* 필터 영역 */}
            <div className="filter-group">
              <div className="filter-group__title">필터링</div>
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
            <div className="search-bar">
              <input
                type="text"
                placeholder="이메일 및 지갑주소로 검색"
                className="search-bar__input"
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
                className="search-bar__btn"
                onClick={() => {
                  setCurrentPage(1);
                  handleGetDataList();
                }}
              >
                <img src={SearchIcon} alt="검색" aria-hidden="true" className="icon-search" />
                <span className="sr-only">검색</span>
              </button>
            </div>
          </div>
          <div className="table-section">
            <div className="table-section-inner">
              {/* table head */}
              <div className="table-section__tit__list-head">
                <div className="col">상태</div>
                <div className="col">입금된 지갑주소</div>
                <div className="col">객단가</div>
                <div className="col">개수</div>
                <div className="col">총금액</div>
                <div className="col">전송할 지갑주소</div>
                <div className="col">액션</div>
              </div>
              {/* table body */}
              {dataList.map((item, index) => (
                <div key={index} className={`list-item ${openIndex === index ? "open" : ""}`}>
                  <div className="list-item__row">
                    <div
                      className={`col status-col
      ${item.state === "pending" ? "status--pending" : ""}
      ${item.state === "cancelled" ? "status--cancelled" : ""}
  `}
                    >
                      {getKoreanState(item.state)}
                    </div>

                    <div className="col wallet-copy-com">
                      {item.deposit_wallet_address}
                      <CopyButton textToCopy={item.deposit_wallet_address} />
                    </div>
                    <div className="col">{item.unit_price}</div>
                    <div className="col">{item.cnt}</div>
                    <div className="col">{item.amount}</div>
                    <div className="col wallet-copy-com">
                      {item.buyer_wallet_address}
                      <CopyButton textToCopy={item.buyer_wallet_address} />
                    </div>
                    <div className="col col--action toggle-btn-box">
                      {/* 상태값 승인대기인 경우 twoway-btn 노출 */}
                      {item.state === "pending" && (
                        <div className="twoway-btn-box --pending">
                          <button
                            className="twoway-btn btn--blue"
                            onClick={() => {
                              console.log("🟢 승인 클릭됨 - item.id:", item.id);
                              handleChangeState(item.id, "approved");
                            }}
                          >
                            승인
                          </button>
                          <button className="twoway-btn btn--red" onClick={() => setConfirmModalOpenId(item.id)}>
                            취소
                          </button>
                        </div>
                      )}

                      {item.state === "cancelled" && (
                        <div className="toway-txt-box --cancelled">
                          <p>{getKoreanState(item.state)}</p>
                          <small>{formatDate(item.approval_cancel_dt)}</small>
                        </div>
                      )}

                      {item.state === "approved" && (
                        <div className="toway-txt-box --approved">
                          <p>{getKoreanState(item.state)}</p>
                          <small>{formatDate(item.approval_dt)}</small>
                        </div>
                      )}
                      <button
                        className={`toggle-btn ${openIndex === index ? "rotate" : ""}`}
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
                          <div className="col col--email">이메일 주소</div>
                          <div className="col">지분</div>
                          <div className="col">정산금</div>
                          <div className="col">지갑주소</div>
                          <div className="col">정산상태</div>
                        </div>

                        {item.referrals?.map((user, i) => (
                          <div className="info-row" key={i}>
                            <div className="col col--email">
                              <Link to={`/OtherSalesRecord?email=${user.username}`}>
                                <span>{user.username}</span>
                                <img src={arrowRightIcon} alt="자세히 보기" className="arrow-icon" />
                              </Link>
                            </div>
                            <div className="col">{user.share}%</div>
                            <div className="col">{user.settlement_amount}</div>
                            <div className="col">{user.wallet_address ? user.wallet_address : "-"}</div>
                            <div className="col settlement-btn-box">
                              {user.is_complt === false ? (
                                <button className="btn--blue-line" onClick={() => handleSettlement(user.id)}>
                                  정산
                                </button>
                              ) : (
                                <span>{formatDate(user.settlement_dt)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
        <Footer />
        {/* table-section 내 '취소' 선택 시 Confirm Modal 노출  */}
        {confirmModalOpenId !== null && (
          <TwowayConfirmModal
            title="해당 거래를 취소처리 하시겠습니까?"
            message="거래 요청을 취소합니다."
            confirmText="OK"
            cancelText="Cancel"
            onConfirm={async () => {
              console.log("🔴 취소 클릭됨 - item.id:", confirmModalOpenId);
              await handleChangeState(confirmModalOpenId, "cancelled");
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
