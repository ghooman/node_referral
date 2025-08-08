import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../assets/images/icon-arrow-up.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";
import closeBtn from "../assets/images/icon-close.svg";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function RecommenderList() {
  const [openIndex, setOpenIndex] = useState(null);

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

  const [isPageLoading, setIsPageLoading] = useState(false);

  // 버튼 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 정렬 필터 오픈 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // 정렬 필터 디폴트
  const [selectedFilter, setSelectedFilter] = useState("최신순");
  // 정렬 필터 API에서 어떤거로 가져올지 상태
  const [selectedSortOption, setSelectedSortOption] = useState("latest"); // 기본값: 최신순

  // 페이지 20씩 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  //----- 초대코드 상태 ----------------------------------------------------
  // 초대 코드 모달 오픈
  const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);
  // 초대코드 생성 시, 분리할 지분 (버튼)
  const [selectedShare, setSelectedShare] = useState("0"); // 기본값 0%
  const [customShare, setCustomShare] = useState("");
  // 초대코드 생성 시, 닉네임 설정
  const [nickname, setNickname] = useState("");
  // 초대코드 생성한 리스트 상태
  const [inviteCodeList, setInviteCodeList] = useState([]);
  // 초대코드 생성 갯수
  const [inviteCodeCnt, setInviteCodeCnt] = useState(0);
  // 초대코드 생성 시 성공 모달
  const [isInviteCodeCreateSuccess, setIsInviteCodeCreateSuccess] =
    useState(false);

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

  //---- 초대코드 ----------------------------------------------------
  // 초대코드 클릭 함수
  const handleClickInviteBtn = async () => {
    setIsOpenInviteModal(true);
  };
  // 초대코드 지분 선택 되었는지 확인 (닉네임은 선택값)
  const isFormValid = selectedShare !== "";

  // 초대코드 한글/영어/숫자 + 최대 10자 제한
  const handleNicknameChange = (e) => {
    const value = e.target.value;

    // 정규식: 한글, 영문, 숫자만 허용
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]*$/;

    if (regex.test(value) && value.length <= 10) {
      setNickname(value);
    }
  };

  // 초대코드 생성하기 버튼 함수
  const handleCreateInviteBtn = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${serverAPI}/api/user/invitation/code`,
        {
          share: Number(selectedShare),
          nick_name: nickname.trim() === "" ? "-" : nickname.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("share", Number(selectedShare));
      console.log("nickname", nickname.trim() === "" ? "-" : nickname);
      console.log("초대코드 생성 성공");
      // ✅ 응답 값 확인
      console.log("status:", res.data.status);
      await fetchInviteCodeList(); // 생성 후 최신 데이터 확인
      setIsLoading(false);
      setIsOpenInviteModal(false);
      setIsInviteCodeCreateSuccess(true);
    } catch (error) {
      console.error("초대코드 생성 에러", error);
      setIsLoading(false);
    }
  };

  // 초대코드 확인 함수
  const fetchInviteCodeList = async () => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(
        `${serverAPI}/api/user/invitation/code/list`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            page: currentPage,
            limit: 20,
            sort_by: selectedSortOption, // 👈 이 부분 연결
          },
        }
      );

      // 전체 응답 보기
      console.log("전체 응답", res.data);

      // 초대코드 리스트만 보기
      const list = res.data.data_list;
      const totalCount = res.data.total_cnt || list.length;
      console.log("초대코드 리스트:", list);
      setInviteCodeList(list);
      setInviteCodeCnt(res.data.total_cnt);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error("초대코드 리스트 가져오기 실패:", error);
      if (error.response) {
        console.log("응답 에러:", error.response.status, error.response.data);
      } else {
        console.log("기타 에러:", error.message);
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  const shareOptions = [
    0,
    Math.floor(userShare / 3), //소수점 버림 처리 (Math.floor)로 고정 지분보다 작거나 같게 유지
    Math.floor((userShare * 2) / 3),
    userShare,
  ];

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

  const [copiedIndex, setCopiedIndex] = useState({ code: null, link: null });

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex((prev) => ({ ...prev, code: index }));
  };

  const handleCopyLink = (code, index) => {
    // url 확정되면 변경 필요
    const fullUrl = `https://affiliate.musicontheblock.com/signup/?r=${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex((prev) => ({ ...prev, link: index }));
  };

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (copiedIndex.code !== null || copiedIndex.link !== null) {
      const timer = setTimeout(() => {
        setCopiedIndex({ code: null, link: null });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  const toggleFilterOpen = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleSelectFilter = (label, value) => {
    setSelectedFilter(label);
    setSelectedSortOption(value); // 이 값이 바뀌면 useEffect 트리거
    setCurrentPage(1); // ✅ 정렬 변경 시 첫 페이지로 이동
    setIsFilterOpen(false);
  };

  // 로그인 후 첫 진입 시, 각 리스트 불러오기!
  useEffect(() => {
    if (userToken) {
      fetchInviteCodeList();
    }
  }, [currentPage, selectedSortOption]);

  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "오래된순", value: "oldest" },
    { label: "지분 오름차순", value: "equity_asc" },
    { label: "지분 내림차순", value: "equity_desc" },
    { label: "할당인원 오름차순", value: "members_asc" },
    { label: "할당인원 내림차순", value: "members_desc" },
  ];

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
              <h2>추천인 리스트 전체보기</h2>
              <span>
                총 <small>{inviteCodeCnt}</small>건
              </span>
            </div>
            <button
              type="button"
              className="sales-section__btn"
              onClick={handleClickInviteBtn}
            >
              초대코드 생성
            </button>
          </div>
          <div className="filter-group">
            <div className="filter-group__title">정렬</div>
            <div
              className={`custom-select ${isFilterOpen ? "is-open" : ""}`}
              onClick={toggleFilterOpen}
            >
              <button type="button" className="custom-select__btn">
                <span>{selectedFilter}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {sortOptions.map((item, index) => (
                  <li
                    key={index}
                    className={
                      selectedSortOption === item.value ? "is-selected" : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFilter(item.label, item.value);
                    }}
                  >
                    {item.label}
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
                    <div className="col">지분</div>
                    <div className="col">초대코드</div>
                    <div className="col mobile-del">닉네임</div>
                    <div className="col mobile-del">할당인원</div>
                    <div className="col mobile-del">코드 생성일</div>
                    <div className="col col--action">액션</div>
                  </div>

                  {/* 초대코드 리스트가 있는 경우 */}
                  {inviteCodeList.length > 0 ? (
                    inviteCodeList.map((item, index) => (
                      <div
                        key={index}
                        className={`list-item ${
                          openIndex === index ? "open" : ""
                        }`}
                      >
                        <div className="list-item__row">
                          <div className="col">{item.share}%</div>
                          <div className="col">{item.invitation_code}</div>
                          <div className="col mobile-del">{item.nick_name}</div>
                          <div className="col mobile-del">
                            {formatNumber(item.allocation_cnt)}
                          </div>
                          <div className="col mobile-del">
                            {formatDate(item.create_dt)}
                          </div>
                          <div className="col col--action invite-code-button toggle-btn-box">
                            <button
                              className={`btn--line-mini ${
                                copiedIndex.code === index ? "copied" : ""
                              }`}
                              onClick={() =>
                                handleCopyCode(item.invitation_code, index)
                              }
                            >
                              {copiedIndex.code === index
                                ? "복사 완료"
                                : "코드 복사"}
                            </button>

                            <button
                              className={`btn--line-mini ${
                                copiedIndex.link === index ? "copied" : ""
                              }`}
                              onClick={() =>
                                handleCopyLink(item.invitation_code, index)
                              }
                            >
                              {copiedIndex.link === index
                                ? "복사 완료"
                                : "링크 복사"}
                            </button>
                            {/* QR코드 주석 처리 (정해진 내용이 없다고 함) */}
                            {/* <button className="btn--line-mini">QR코드</button> */}
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

                    {openIndex === index && item.user_list?.length > 0 && (
                      <div className="list-item__detail invite-code">
                        {item.user_list.map((user, i) => (
                          <div key={i} className="email-row">
                            <Link to={`/affiliate/other-sales-record?email=${user.username}`}>
                              <span className="index">{i + 1}</span>
                              <span className="email">{user.username}</span>
                            </Link>
                            <button className="arrow">
                              <img src={arrowRightIcon} alt="더보기" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="table-empty">생성한 초대코드 리스트가 없습니다.</div>
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
      {/* '초대코드 생성' 선택 시 '초대코드 생성' Modal 노출 */}
      {isOpenInviteModal && (
        <FullModalWrap>
          <div className="modal modal-create-code">
            <div className="modal__content">
              <div className="modal__header">
                <h2>초대코드 생성</h2>
                <button
                  type="button"
                  onClick={() => setIsOpenInviteModal(false)}
                >
                  <img src={closeBtn} alt="팝업 닫기" />
                </button>
              </div>
              <div className="modal__body">
                <div className="user-share">
                  <div>
                    <b>나의 지분</b>
                    <span>{userShare}%</span>
                  </div>
                  <div>
                    <b>분리할 지분</b>
                    <span>{selectedShare}%</span>
                  </div>
                </div>
                <div className="share-setting">
                  <p className="share-setting__label">지분 설정</p>
                  <div
                    className="share-setting__options"
                    role="radiogroup"
                    aria-label="지분 설정"
                  >
                    <div className="share-setting__left">
                      {shareOptions.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`share-option ${
                            selectedShare === String(value) ? `is-active` : ""
                          }`}
                          onClick={() => {
                            setSelectedShare(String(value));
                            setCustomShare(""); // 직접 입력값 초기화
                          }}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={userShare} // 나의 지분 예시
                      value={customShare}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomShare(value);
                        setSelectedShare(value); // 같이 반영하기
                      }}
                      placeholder=" ≤ nn %"
                      className="share-option"
                    ></input>
                  </div>
                </div>
                <InputField
                  id="userNickName"
                  label="닉네임"
                  type="text"
                  placeholder="닉네임을 입력해 주세요"
                  required
                  value={nickname}
                  onChange={handleNicknameChange}
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${
                    isFormValid ? "" : "btn--disabled"
                  } ${isLoading ? "btn--loading" : ""}`}
                  disabled={!isFormValid}
                  onClick={handleCreateInviteBtn}
                >
                  {isLoading ? "초대코드 생성 중" : "초대코드 생성"}
                  <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </FullModalWrap>
      )}

      {/* '초대코드 생성' 완료 시 Confirm Modal 노출  */}
      {isInviteCodeCreateSuccess && (
        <ConfirmModal
          title="초대코드 생성 완료"
          message="초대코드를 성공적으로 생성했습니다."
          buttonText="확인"
          onClose={() => {}}
          onClick={() => setIsInviteCodeCreateSuccess(false)}
        />
      )}
    </>
  );
}

export default RecommenderList;
