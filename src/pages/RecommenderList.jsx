import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import LoadingDots from "../components/unit/LoadingDots";
import FullModalWrap from "../components/modal/FullModalWrap";
import ConfirmModal from "../components/modal/ConfirmModal";
import InputField from "../components/unit/InputField";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";

// img
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";
import closeBtn from "../assets/images/icon-close.svg";

import "../components/dashboard/InviteCodeList.scss";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function RecommenderList() {
  const userToken = localStorage.getItem("userToken");
  //----- 상태 ------------------------------------------------------------------------------------
  // 사용자 정보 상태
  const [userShare, setUserShare] = useState("");

  // 버튼 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 기존 상태 중 이 두 줄에서 'selectedFilter'는 제거
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("latest"); // 서버로 보낼 키만 유지

  // 초대 코드, 링크 복사 관리
  const [copiedIndex, setCopiedIndex] = useState({ code: null, link: null });

  // 페이지 20씩 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const [openIndex, setOpenIndex] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

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
  const [isInviteCodeCreateSuccess, setIsInviteCodeCreateSuccess] = useState(false);

  //----- API 호출 함수  ------------------------------------------------------------------------------------
  // 사용자 정보 가져오는 함수
  const userInfo = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/user/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("API에서 받아온 사용자 정보", res.data);
      setUserShare(res.data.share);
    } catch (error) {
      console.error("사용자 정보 가져오는 함수 error입니당", error);
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
      // 응답 값 확인
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
      const res = await axios.get(`${serverAPI}/api/user/invitation/code/list`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          page: currentPage,
          limit: 20,
          sort_by: selectedSortOption,
        },
      });

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

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
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

  // 초대코드 복사 함수
  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex((prev) => ({ ...prev, code: index }));
  };

  // 초대링크 복사 함수
  const handleCopyLink = (code, index) => {
    // url 확정되면 변경 필요
    const fullUrl = `https://affiliate.musicontheblock.com/signup/?r=${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex((prev) => ({ ...prev, link: index }));
  };

  // 우측 화살표 토글
  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // 사용자의 share값에 따른 가능한 초대코드 분배
  const shareOptions = [
    0,
    Math.floor(userShare / 3), //소수점 버림 처리 (Math.floor)로 고정 지분보다 작거나 같게 유지
    Math.floor((userShare * 2) / 3),
    userShare,
  ];

  //----- 필터 제어 ------------------------------------------------------------------------------------
  // 필터 드롭다운 순서
  const STATUS_OPTIONS = [
    { key: "latest", value: "Latest" },
    { key: "oldest", value: "Oldest" },
    { key: "equity_asc", value: "Share Ascending" },
    { key: "equity_desc", value: "Share Descending" },
    { key: "members_asc", value: "Members Ascending" },
    { key: "members_desc", value: "Members Descending" },
  ];

  // 필터 라벨링
  const statusLabelMap = React.useMemo(() => Object.fromEntries(STATUS_OPTIONS.map((o) => [o.key, o.value])), []);
  const currentSortLabel = statusLabelMap[selectedSortOption] ?? "Latest";

  //----- useEffect 모음  ------------------------------------------------------------------------------------
  // userToken이 존재하면 사용자 정보 호출하기!
  useEffect(() => {
    if (userToken) {
      userInfo();
    }
  }, [userToken]);

  useEffect(() => {
    if (copiedIndex.code !== null || copiedIndex.link !== null) {
      const timer = setTimeout(() => {
        setCopiedIndex({ code: null, link: null });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  // 로그인 후 첫 진입 시, 각 리스트 불러오기!
  useEffect(() => {
    if (userToken) {
      fetchInviteCodeList();
    }
  }, [currentPage, selectedSortOption]);

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper padding-del">
          <div className="sales-section">
            <div className="sales-section__record-tit-box">
              <div className="sales-section__record-tit">
                <h2>Invite Code</h2>
                <span>
                  Total <small>{inviteCodeCnt}</small>
                </span>
              </div>
              <button type="button" className="sales-section__btn" onClick={handleClickInviteBtn}>
                Create Invite Code
              </button>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button type="button" className="custom-select__btn" onClick={() => setIsFilterOpen((prev) => !prev)}>
                <span>{currentSortLabel}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {STATUS_OPTIONS.map((opt) => (
                  <li
                    key={opt.key}
                    className={selectedSortOption === opt.key ? "is-selected" : ""}
                    onClick={() => {
                      if (selectedSortOption !== opt.key) {
                        setSelectedSortOption(opt.key); // 한 상태만 갱신
                        setCurrentPage(1);
                      }
                      setIsFilterOpen(false);
                    }}
                  >
                    {opt.value}
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
                    <div className="col">Share</div>
                    <div className="col">Invite Code</div>
                    <div className="col mobile-del">Nickname</div>
                    <div className="col mobile-del">Allocated Users</div>
                    <div className="col mobile-del">Created Date</div>
                    <div className="col col--action">Action</div>
                  </div>

                  {/* 초대코드 리스트가 있는 경우 */}
                  {inviteCodeList.length > 0 ? (
                    inviteCodeList.map((item, index) => (
                      <div key={index} className={`list-item ${openIndex === index ? "open" : ""}`}>
                        <div className="list-item__row">
                          <div className="col">{item.share}%</div>
                          <div className="col">{item.invitation_code}</div>
                          <div className="col mobile-del">{item.nick_name}</div>
                          <div className="col mobile-del">{item.allocation_cnt}</div>
                          <div className="col mobile-del">{formatDate(item.create_dt)}</div>
                          <div className="col col--action invite-code-button toggle-btn-box">
                            <button
                              className={`btn--line-mini ${copiedIndex.code === index ? "copied" : ""}`}
                              onClick={() => handleCopyCode(item.invitation_code, index)}
                            >
                              {copiedIndex.code === index ? "Copied" : "Copy Code"}
                            </button>

                            <button
                              className={`btn--line-mini ${copiedIndex.link === index ? "copied" : ""}`}
                              onClick={() => handleCopyLink(item.invitation_code, index)}
                            >
                              {copiedIndex.link === index ? "Copied" : "Copy Link"}
                            </button>
                            {/* QR코드 주석 처리 (정해진 내용이 없다고 함) */}
                            {/* <button className="btn--line-mini">QR코드</button> */}
                            <button
                              className={`toggle-btn ${openIndex === index ? "rotate" : ""}`}
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
                                <Link to={`/other-sales-record?email=${user.username}`}>
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
                    <div className="table-empty">No generated invite codes.</div>
                  )}
                </>
              )}
            </div>
          </section>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
        <Footer />
      </div>
      {/* '초대코드 생성' 선택 시 '초대코드 생성' Modal 노출 */}
      {isOpenInviteModal && (
        <FullModalWrap>
          <div className="modal modal-create-code create">
            <div className="modal__content">
              <div className="modal__header">
                <h2>Create Invite Code</h2>
                <button type="button" onClick={() => setIsOpenInviteModal(false)}>
                  <img src={closeBtn} alt="팝업 닫기" />
                </button>
              </div>
              <div className="modal__body">
                <div className="user-share">
                  <div>
                    <b>My Share</b>
                    <span>{userShare}%</span>
                  </div>
                  <div>
                    <b>Share to Allocate</b>
                    <span>{selectedShare}%</span>
                  </div>
                </div>
                <div className="share-setting">
                  <p className="share-setting__label">Set Share</p>
                  <div className="share-setting__options" role="radiogroup" aria-label="지분 설정">
                    <div className="share-setting__left">
                      {shareOptions.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`share-option ${selectedShare === String(value) ? `is-active` : ""}`}
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
                      placeholder={`≤ ${userShare} %`}
                      className="share-option"
                    ></input>
                  </div>
                </div>
                <InputField
                  id="userNickName"
                  label="Nickname"
                  type="text"
                  placeholder="Enter nickname"
                  required
                  value={nickname}
                  onChange={handleNicknameChange}
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${isFormValid ? "" : "btn--disabled"} ${
                    isLoading ? "btn--loading" : ""
                  }`}
                  disabled={!isFormValid}
                  onClick={handleCreateInviteBtn}
                >
                  {isLoading ? "Creating..." : "Create Invite Code"}
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
          title="Invite Code Created"
          message="Invite code created successfully."
          buttonText="OK"
          onClose={() => {}}
          onClick={() => setIsInviteCodeCreateSuccess(false)}
        />
      )}
    </>
  );
}

export default RecommenderList;
