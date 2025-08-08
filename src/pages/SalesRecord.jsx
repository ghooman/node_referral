import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
// compomnents
import HeaderBack from "../components/unit/HeaderBack";
import Footer from "../components/unit/Footer";
import LoadingDots from "../components/unit/LoadingDots";
import FullModalWrap from "../components/modal/FullModalWrap";
import ConfirmModal from "../components/modal/ConfirmModal";
import CopyButton from "../components/unit/CopyButton";
import SalesRecordList from "../components/dashboard/SalesRecordList";
import InputField from "../components/unit/InputField";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";
// img
import arrowUpIcon from "../assets/images/icon-arrow-up.svg";
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import closeBtn from "../assets/images/icon-close.svg";

import "../styles/pages/SalesRecord.scss";
import "../components/dashboard/SalesRecordList.scss";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function SalesRecord() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
  const data = [
    {
      buyer: "홍길동",
      count: 3,
      unitPrice: "50 USDT",
      total: "150 USDT",
      settlement: "100 USDT",
      date: "2025.07.14",
      status: "승인요청",
      statusType: "request",
      wallet: "8687678678678678678687",
      memo: "테스트 메모",
      approveDate: "2025.07.15",
      completeDate: "2025.07.17",
    },
  ];

  //---- 공통 상태 ----------------------------------------------------
  // 사용자 정보 상태
  const [userName, setUserName] = useState("");
  const [userShare, setUserShare] = useState("");
  const [userWallet, setUserWallet] = useState("");
  const [userOfficeWallet, setUserOfficeWallet] = useState("");

  const [userWalletInput, setUserWalletInput] = useState("");
  const [userWalletEdit, setUserWalletEdit] = useState("");

  const userToken = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  const isMaster = userRole === "master";

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 필터 정렬 상태
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [showConfirmModalIndex, setShowConfirmModalIndex] = useState(null);
  const [cancelTargetId, setCancelTargetId] = useState(null);

  // 버튼 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  //---- 대시보드 상태 ----------------------------------------------------
  // 중단 4개 (나의)
  const [myRevenue, setMyRevenue] = useState(0);
  const [mySettlement, setMySettlement] = useState(0);
  const [myReferrals, setMyReferrals] = useState(0);
  const [mySoldNode, setMySoldNode] = useState(0);

  //---- 새 거래 등록 상태 ----------------------------------------------------
  // 새 거래 등록 정보
  const [newDealUser, setNewDealUser] = useState("");
  const [newDealPerPrice, setNewDealPerPrice] = useState("");
  const [newDealNumber, setNewDealNumber] = useState("");
  const [newDealTotalAmount, setNewDealTotalAmount] = useState(0);
  const [newDealWallet, setNewDealWallet] = useState("");
  const [newDealNote, setNewDealNote] = useState("");
  const [isNewDealValid, setIsNewDealValid] = useState(false);
  // 새 거래 등록 모달 오픈
  const [isOpenNewDealModal, setIsOpenNewDealModal] = useState(false);
  // 컨펌 모달 오픈 (새 거래 등록 눌렀을 때 지갑 주소 없을 경우 나오는 모달)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  // 새 거래 등록 생성한 리스트 상태
  const [newDealList, setNewDealList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  // 새 거래 등록 생성 시 성공 모달
  const [isNewDealCreateSuccess, setIsNewDealCreateSuccess] = useState(false);

  //---- 공통 ----------------------------------------------------
  // 사용자 정보 가져오는 함수
  const userInfo = async () => {
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
    } catch (error) {
      console.error("사용자 정보 가져오는 함수 error입니당", error);
    }
  };
  // userToken이 존재하면 사용자 정보 호출하기!
  useEffect(() => {
    if (userToken) {
      userInfo();
    }
  }, [userToken]);

  //---- 대시보드 ----------------------------------------------------
  // 대시보드 정보 값 가져오는 함수
  const handleGetDashboardData = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/my/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("API에서 받아온 대시보드 정보", res.data);
      // 중단 4개 (나의)
      setMyRevenue(res.data.my_sales_revenue);
      setMySettlement(res.data.my_settlement);
      setMyReferrals(res.data.my_referrals);
      setMySoldNode(res.data.my_sold_nodes);
    } catch (error) {
      console.error("대시보드 정보 값 가져오는 함수 error입니당", error);
    }
  };

  // 로그인 후 첫 진입 시, 각 리스트 불러오기!
  useEffect(() => {
    if (userToken) {
      handleGetDashboardData();
      fetchNewDealList();
    }
  }, [selectedStatus, currentPage]);

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

  //---- 새 거래등록 ----------------------------------------------------
  // 새 거래등록 클릭 함수
  const handleClickNewDealBtn = async () => {
    if (!userWallet) {
      setIsOpenConfirmModal(true);
    } else {
      setIsOpenNewDealModal(true);
    }
  };

  // 새 거래등록 총 금액 자동 계산
  useEffect(() => {
    const price = parseInt(newDealPerPrice, 10);
    const count = parseInt(newDealNumber, 10);

    if (!isNaN(price) && !isNaN(count)) {
      setNewDealTotalAmount(price * count);
    } else {
      setNewDealTotalAmount(0);
    }
  }, [newDealPerPrice, newDealNumber]);
  // 새 거래등록 유효성 검사 및 버튼 활성화 로직
  useEffect(() => {
    const isUserValid = /^[a-zA-Z가-힣]{1,8}$/.test(newDealUser);
    const isPerPriceValid = /^\d+$/.test(newDealPerPrice);
    const isNumberValid = /^\d+$/.test(newDealNumber);
    const isWalletValid = newDealWallet.trim().length > 0;

    if (isUserValid && isPerPriceValid && isNumberValid && isWalletValid) {
      setIsNewDealValid(true);
    } else {
      setIsNewDealValid(false);
    }
  }, [newDealUser, newDealPerPrice, newDealNumber, newDealWallet]);
  // 새 거래등록 글자갯수 포맷팅 (이름)
  const handleBuyerNameChange = (e) => {
    const value = e.target.value;
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]*$/; // 한글/영문만 허용

    if (regex.test(value) && value.length <= 8) {
      setNewDealUser(value);
    }
  };
  // 새 거래등록 글자갯수 포맷팅 (비고)
  const handleNoteChange = (e) => {
    const value = e.target.value;
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s.,!?()'"-]*$/; // 문장 기호도 허용하면 이렇게

    if (regex.test(value) && value.length <= 30) {
      setNewDealNote(value);
    }
  };
  // 새 거래등록 필드 초기화
  const resetNewDealFields = () => {
    setNewDealUser("");
    setNewDealPerPrice("");
    setNewDealNumber("");
    setNewDealTotalAmount(0);
    setNewDealWallet("");
    setNewDealNote("");
    setIsNewDealValid(false); // 등록 버튼 비활성화 초기화
  };

  // 새 거래등록 최종 등록하는 함수
  const handleNewDealSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("서버로 보내는 거래등록 내용 모음!");
      console.log("newDealUser", newDealUser);
      console.log("newDealPerPrice", newDealPerPrice);
      console.log("newDealNumber", newDealNumber);
      console.log("newDealTotalAmount", newDealTotalAmount);
      console.log("newDealWallet", newDealWallet);
      console.log("newDealNote", newDealNote);
      await axios.post(
        `${serverAPI}/api/sales/record`,
        {
          buyer_name: newDealUser,
          unit_price: parseInt(newDealPerPrice, 10),
          cnt: parseInt(newDealNumber, 10),
          buyer_wallet_address: newDealWallet,
          memo: newDealNote,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("새 거래등록 서버 전달 완료~!");
      await fetchNewDealList();
      resetNewDealFields(); // 입력 필드 초기화
      setIsLoading(false);
      setIsOpenNewDealModal(false);
      setIsNewDealCreateSuccess(true);
    } catch (error) {
      console.error("새 거래등록 최종 등록하는 함수 error입니당", error);
      setIsLoading(false);
    }
  };
  // 새 거래등록 확인 함수
  const fetchNewDealList = async () => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(`${serverAPI}/api/sales/list`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          page: currentPage,
          limit: 20,
          state: selectedStatus === "all" ? undefined : selectedStatus,
        },
      });
      const list = res.data.data_list;
      const totalCount = res.data.total_cnt || list.length;
      console.log("전체 응답", res.data);
      setNewDealList(list);
      setTotalCnt(res.data.total_cnt);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error("새 거래등록 리스트 가져오기 실패", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const getKoreanState = (state) => {
    const stateMap = {
      requested: "승인요청",
      pending: "승인대기",
      cancelled: "승인취소",
      approved: "승인완료",
      settlement_pending: "정산대기",
      settled: "정산완료",
    };
    return stateMap[state] || state;
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

  const getBadgeClassName = (state) => {
    return state; // 상태명이 곧 className과 동일함
  };

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

      // 상태만 변경하는 경우
      const updatedList = newDealList.map((item) =>
        item.id === salesId ? { ...item, state: newState } : item
      );
      setNewDealList(updatedList);

      // 혹은 최신 상태 fetch
      await fetchNewDealList();

      setShowConfirmModalIndex(null);
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  const handleCancelRequest = async (salesId) => {
    console.log("🟡 취소 요청 시도 중 - salesId:", salesId);
    try {
      const res = await axios.post(
        `${serverAPI}/api/sales/${salesId}/cancel`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("🟢 승인요청 취소 성공:", res.data);
      await fetchNewDealList(); // 리스트 갱신
    } catch (error) {
      console.error("🔴 승인요청 취소 실패:", error);
    }
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
              <h2>내 판매기록 전체보기</h2>
              <span>
                총 <small>{totalCnt}</small>건
              </span>
            </div>
            <ul className="sales-section__record-list">
              <li>
                <h3>나의 판매 수입</h3>
                <p>{formatNumber(myRevenue)}</p>
              </li>
              <li>
                <h3>나의 판매 정산금</h3>
                <p>{formatNumber(mySettlement)}</p>
              </li>
              <li>
                <h3>나의 추천인</h3>
                <p>{formatNumber(myReferrals)}</p>
              </li>
              <li>
                <h3>나의 판매 노드 수</h3>
                <p>{formatNumber(mySoldNode)}</p>
              </li>
            </ul>
            <button
              type="button"
              className="sales-section__btn"
              onClick={handleClickNewDealBtn}
            >
              새 거래 등록
            </button>
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
                  {/* list-head는 항상 보여줌 */}
                  <div className="table-section__tit__list-head sales-record">
                    <div className="col">구매자</div>
                    <div className="col mobile-del">개수</div>
                    <div className="col mobile-del">객단가</div>
                    <div className="col">총 금액</div>
                    <div className="col">정산금</div>
                    <div className="col mobile-del">등록일시</div>
                    <div className="col">상태</div>
                    <div className="col">액션</div>
                  </div>

                  {/* 데이터 유무에 따라 item or empty */}
                  {newDealList.length === 0 ? (
                    // 판매 기록이 없는 경우
                    <div className="table-empty">판매 기록이 없습니다.</div>
                  ) : (
                    [...newDealList]
                      .sort(
                        (a, b) => new Date(b.create_dt) - new Date(a.create_dt)
                      )
                      .map((item, index) => (
                        <div
                          className={`list-item ${
                            openIndex === index ? "open" : ""
                          }`}
                          key={index}
                        >
                          <div className="list-item__row sales-record">
                            <div className="col">{item.buyer_name}</div>
                            <div className="col mobile-del">
                              {formatNumber(item.cnt)}
                            </div>
                            <div className="col mobile-del">
                              {formatNumber(item.unit_price)}
                            </div>
                            <div className="col">
                              {formatNumber(item.cnt * item.unit_price)}
                            </div>
                            <div className="col">
                              {formatNumber(item.settlement_amount)}
                            </div>
                            <div className="col mobile-del">
                              {formatDate(item.create_dt)}
                            </div>
                            <div className="col toggle-btn-box">
                              <button
                                className={`badge badge--${getBadgeClassName(
                                  item.state
                                )}`}
                                onClick={() => {
                                  console.log(
                                    "🟡 버튼 클릭됨 - 현재 상태:",
                                    item.state,
                                    "id:",
                                    item.id
                                  );

                                  if (item.state === "requested") {
                                    console.log(
                                      "🟢 승인요청 상태 → pending 으로 변경 시도"
                                    );
                                    // handleChangeState(item.id, "pending");
                                    setShowConfirmModalIndex(item.id);
                                  } else {
                                    console.log(
                                      "🔴 승인요청 상태가 아니라서 아무 작업도 하지 않음"
                                    );
                                  }
                                }}
                              >
                                {getKoreanState(item.state)}
                              </button>
                            </div>
                            <div className="col toggle-btn-box">
                              {/* 취소 버튼 감싸는 래퍼는 항상 존재하지만 내부는 조건부 */}
                              <div className="cancel-wrap">
                                {["requested", "pending"].includes(
                                  item.state
                                ) ? (
                                  <button
                                    className="btn-line-cancel"
                                    onClick={() => setCancelTargetId(item.id)}
                                  >
                                    취소
                                  </button>
                                ) : (
                                  <span
                                    style={{
                                      visibility: "hidden",
                                      minWidth: "60px",
                                    }}
                                  >
                                    -
                                  </span> // 공간 유지용
                                )}
                              </div>

                              {/* 화살표 버튼은 항상 렌더링 */}
                              <div className="arrow-wrap">
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
                          </div>

                          {openIndex === index && (
                            <div className="list-item__detail">
                              <div className="list-item__detail__list">
                                <p>
                                  <b>지갑주소</b>
                                  <span>
                                    {item.buyer_wallet_address}
                                    <CopyButton
                                      textToCopy={item.buyer_wallet_address}
                                    />
                                  </span>
                                </p>
                                <p>
                                  <b>비고</b>
                                  <span>{item.memo ? item.memo : "-"}</span>
                                </p>
                              </div>
                              <div className="list-item__detail__list">
                                <p>
                                  <b>승인완료 날짜</b>
                                  <span>
                                    {item.approval_dt
                                      ? formatDate(item.approval_dt)
                                      : "-"}
                                  </span>
                                </p>
                                <p>
                                  <b>정산완료 날짜</b>
                                  <span>
                                    {item.settlement_dt
                                      ? formatDate(item.settlement_dt)
                                      : "-"}
                                  </span>
                                </p>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Footer />
      </div>

      {/* '새 거래 등록' 선택 시 거래 등록 모달 노출  */}
      {isOpenNewDealModal && userWallet && (
        <FullModalWrap>
          <div className="modal modal-transaction">
            <div className="modal__content">
              <div className="modal__header">
                <h2>거래등록</h2>
                <button
                  type="button"
                  onClick={() => {
                    resetNewDealFields();
                    setIsOpenNewDealModal(false);
                  }}
                >
                  <img src={closeBtn} alt="팝업 닫기" />
                </button>
              </div>
              <div className="modal__body">
                <InputField
                  id="buyerName"
                  label="구매자명"
                  type="text"
                  placeholder="구매자명을 입력해 주세요"
                  required
                  value={newDealUser}
                  onChange={handleBuyerNameChange}
                />
                <div className="twoway-inputField">
                  <div>
                    <InputField
                      type="text"
                      id="avgPrice"
                      label="객단가"
                      placeholder="객단가 입력"
                      required
                      value={newDealPerPrice}
                      onChange={(e) => setNewDealPerPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label="판매 개수"
                      id="salesCount"
                      placeholder="판매 노드 개수 입력"
                      required
                      value={newDealNumber}
                      onChange={(e) => setNewDealNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="total-amount-field">
                  <b>총 금액(자동계산)</b>
                  <p>
                    <span>{newDealTotalAmount.toLocaleString()} </span>USDT
                  </p>
                </div>
                <InputField
                  id="buyerWalletAddress"
                  label="구매자 지갑 주소"
                  type="text"
                  placeholder="노드를 받을 구매자의 지갑 주소를 입력해 주세요"
                  required
                  value={newDealWallet}
                  onChange={(e) => setNewDealWallet(e.target.value)}
                />
                <InputField
                  id="addInput"
                  label="비고"
                  type="text"
                  placeholder="최대 30자까지 입력 가능합니다"
                  maxLength={30}
                  value={newDealNote}
                  onChange={handleNoteChange}
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${
                    isNewDealValid ? "" : "btn--disabled"
                  } ${isLoading ? "btn--loading" : ""}`}
                  disabled={!isNewDealValid}
                  onClick={handleNewDealSubmit}
                >
                  {isLoading ? "거래등록 중" : "거래등록 완료"} <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </FullModalWrap>
      )}

      {/* '새 거래 등록' 완료 시 Confirm Modal 노출  */}
      {isNewDealCreateSuccess && (
        <ConfirmModal
          title="등록 완료"
          message="등록 후 승인요청 버튼을 꼭 클릭해 주세요. 노드 전송 및 정산금 입금은 영업일 기준 2~3일 소요됩니다."
          buttonText="확인"
          onClose={() => {}}
          onClick={() => setIsNewDealCreateSuccess(false)}
        />
      )}

      {showConfirmModalIndex !== null && (
        <ConfirmModal
          title="승인 요청"
          message={`요청 전송 시 노드 전송 및 정산을 진행합니다.\n노드 전송 및 정산금 입금은 영업일 기준 2~3일 소요됩니다.`}
          onClose={() => setShowConfirmModalIndex(null)}
          onConfirm={() => {
            handleChangeState(showConfirmModalIndex, "pending");
            setShowConfirmModalIndex(null);
          }}
        />
      )}

      {cancelTargetId !== null && (
        <ConfirmModal
          title="거래 등록 취소"
          message={`입력한 내용이 전부 삭제됩니다.\n거래 등록을 취소하시겠습니까?`}
          buttonText="확인"
          onClick={async () => {
            console.log("🟡 최종 취소 확정 - salesId:", cancelTargetId);
            await handleCancelRequest(cancelTargetId); // 실제 취소 API 호출
            setCancelTargetId(null);
          }}
          onClose={() => setCancelTargetId(null)}
        />
      )}
    </>
  );
}

export default SalesRecord;
