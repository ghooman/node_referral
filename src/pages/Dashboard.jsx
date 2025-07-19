import { Link } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
// Components
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import LoadingDots from "../components/unit/LoadingDots";
import ModalWrap from "../components/modal/ModalWrap";
import FullModalWrap from "../components/modal/FullModalWrap";
import ConfirmModal from "../components/modal/ConfirmModal";
import CopyButton from "../components/unit/CopyButton";
import SalesRecordList from "../components/dashboard/SalesRecordList";
import InviteCodeList from "../components/dashboard/InviteCodeList";
import ReferralEarnings from "../components/dashboard/ReferralEarnings";
import InputField from "../components/unit/InputField";
// img
import penIcon from "../assets/images/icon-pen.svg";
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../assets/images/icon-arrow-up.svg";
import closeBtn from "../assets/images/icon-close.svg";
// style
import "../styles/pages/Dashboard.scss";
import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function Dashboard() {
  const [openSalesIndex, setOpenSalesIndex] = useState(null);
  const [openInviteIndex, setOpenInviteIndex] = useState(null);
  const [openEarningsIndex, setOpenEarningsIndex] = useState(null);

  // 지갑주소 등록 모달 오픈
  const [isOpenAddWalletModal, setIsOpenAddWalletModal] = useState(false);
  // 지갑주소 수정 모달 오픈
  const [isOpenEditWalletModal, setIsOpenEditWalletModal] = useState(false);
  // 초대 코드 모달 오픈
  const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);
  // 초대코드 생성 시, 분리할 지분 (버튼)
  const [selectedShare, setSelectedShare] = useState("5"); // 기본값 5%
  const [customShare, setCustomShare] = useState("");
  // 초대코드 생성 시, 닉네임 설정
  const [nickname, setNickname] = useState("");
  // 초대코드 생성한 리스트 상태
  const [inviteCodeList, setInviteCodeList] = useState([]);
  // 새 거래 등록 모달 오픈
  const [isOpenNewDealModal, setIsOpenNewDealModal] = useState(false);
  // 컨펌 모달 오픈 (새 거래 등록 눌렀을 때 지갑 주소 없을 경우 나오는 모달)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  // 사용자 정보 상태
  const [userName, setUserName] = useState("");
  const [userShare, setUserShare] = useState("");
  const [userWallet, setUserWallet] = useState("");
  const [userOfficeWallet, setUserOfficeWallet] = useState("");
  const [userWalletInput, setUserWalletInput] = useState("");
  const [userWalletEdit, setUserWalletEdit] = useState("");
  const userToken = localStorage.getItem("userToken");

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
  // 초대코드 클릭 함수
  const handleClickInviteBtn = async () => {
    setIsOpenInviteModal(true);
  };
  // 새 거래등록 클릭 함수
  const handleClickNewDealBtn = async () => {
    if (!userWallet) {
      setIsOpenConfirmModal(true);
    } else {
      setIsOpenNewDealModal(true);
    }
  };

  // 지분 선택 되었는지 확인 (닉네임은 선택값)
  const isFormValid = selectedShare !== "";

  // 한글/영어/숫자 + 최대 10자 제한
  const handleNicknameChange = (e) => {
    const value = e.target.value;

    // 정규식: 한글, 영문, 숫자만 허용
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]*$/;

    if (regex.test(value) && value.length <= 10) {
      setNickname(value);
    }
  };

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
  // 지갑주소 등록하는 함수
  const handleSaveWallet = async (finalWallet) => {
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
      userInfo(); // 사용자 정보 새롭게 갱신하기!
    } catch (error) {
      console.error("지갑주소 등록/수정 error입니당", error);
    }
  };
  // 지갑 주소 포맷팅 함수 (앞뒤 4글자씩 짜르기 0x00....0000)
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };
  // 초대코드 생성하기 버튼 함수
  const handleCreateInviteBtn = async () => {
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
    } catch (error) {
      console.error("초대코드 생성 에러", error);
    }
  };

  // 초대코드 확인 함수
  const fetchInviteCodeList = async () => {
    try {
      const res = await axios.get(
        `${serverAPI}/api/user/invitation/code/list`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            page: 1,
            limit: 20,
            // sort_by: "create_dt" // 선택적으로 사용 가능
          },
        }
      );

      // 전체 응답 보기
      console.log("전체 응답", res.data);

      // 초대코드 리스트만 보기
      const list = res.data.data_list;
      console.log("초대코드 리스트:", list);
      setInviteCodeList(list);

      // // 첫 번째 코드의 정보
      // if (list.length > 0) {
      //   const first = list[0];
      //   console.log("코드:", first.invitation_code);
      //   console.log("닉네임:", first.nick_name);
      //   console.log("지분:", first.share);
      //   console.log("등록일:", first.create_dt);
      //   console.log("할당된 인원 수:", first.allocation_cnt);

      //   // 하위 유저 목록
      //   console.log("하위 유저 목록:");
      //   first.user_list.forEach((user, idx) => {
      //     console.log(`  ${idx + 1}. ${user.username}`);
      //   });
      // } else {
      //   console.log("아직 생성된 초대코드가 없습니다.");
      // }
    } catch (error) {
      console.error("초대코드 리스트 가져오기 실패:", error);
      if (error.response) {
        console.log("응답 에러:", error.response.status, error.response.data);
      } else {
        console.log("기타 에러:", error.message);
      }
    }
  };
  // 로그인 후 첫 진입 시, 초대코드 리스트 불러오기!
  useEffect(() => {
    if (userToken) {
      fetchInviteCodeList();
    }
  }, []);
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

  const salesData = [
    {
      buyer: "김첨지",
      count: 100,
      unitPrice: 3,
      total: 300,
      settlement: 180.15,
      date: "2025.06.02 17:48",
      status: "승인 요청",
      statusType: "requested",
      wallet: "0x8687****7868786878687",
      memo: "구매한 사람에 대한 메모 최대 30자",
      approveDate: "2025.06.03 13:00",
      completeDate: "-",
    },
    {
      buyer: "홍길동",
      count: 20,
      unitPrice: 5,
      total: 100,
      settlement: 70.5,
      date: "2025.07.01 10:20",
      status: "승인 대기",
      statusType: "ready",
      wallet: "0x7788****1234567890",
      memo: "2차 구매자",
      approveDate: "-",
      completeDate: "-",
    },
  ];

  const handleSalesToggle = (index) => {
    setOpenSalesIndex((prev) => (prev === index ? null : index));
  };

  const handleInviteToggle = (index) => {
    setOpenInviteIndex((prev) => (prev === index ? null : index));
  };

  const handleEarningsToggle = (index) => {
    setOpenEarningsIndex((prev) => (prev === index ? null : index));
  };
  return (
    <>
      <Header />
      <div className="page-wrapper dashboard-wrapper">
        <div className="user-section">
          <p className="user-section__email">{userName}</p>
          <ul className="user-section__wallet">
            <li>
              <span>나의 지분</span>
              <strong>{userShare}%</strong>
            </li>
            <li>
              <span>본사 입금 지갑주소</span>
              <div className="user-section__wallet__copy-com">
                {/* <strong>{formatWalletAddress(userOfficeWallet)}</strong> */}
                <strong>0x00....0000</strong>
                <CopyButton textToCopy={userOfficeWallet} />
              </div>
            </li>
            <li>
              <span>내 지갑주소</span>
              {!userWallet ? (
                <button
                  type="button"
                  className="btn-register"
                  onClick={handleClickAddWalletBtn}
                >
                  지갑주소 등록
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
          </ul>
        </div>

        {/* 대시보드 */}
        <section className="dash-section">
          <h2 className="dash-section__tit">Dashboard</h2>
          <div className="dash-section__txt">
            <ul className="dash-section__txt__board">
              <li>
                <h3>전체 수입 (USDT)</h3>
                <p>13,583,922</p>
              </li>
              <li>
                <h3>전체 정산금 (USDT)</h3>
                <p>6,753,521</p>
              </li>
              <li>
                <h3>전체 추천인</h3>
                <p>3,482</p>
              </li>
              <li>
                <h3>전체 판매 노드 수 (NODE)</h3>
                <p>43,393,203</p>
              </li>
            </ul>
            <ul className="dash-section__txt__list">
              <li>
                <h3>나의 판매 수입</h3>
                <p>3,284,224</p>
              </li>
              <li>
                <h3>나의 판매 정산금</h3>
                <p>1,864,392</p>
              </li>
              <li>
                <h3>나의 추천인</h3>
                <p>33</p>
              </li>
              <li>
                <h3>나의 판매 노드 수</h3>
                <p>4,203</p>
              </li>
              <li>
                <h3>하위자 판매 수입</h3>
                <p>10,305,155</p>
              </li>
              <li>
                <h3>하위자 판매 정산금</h3>
                <p>4,153,552</p>
              </li>
              <li>
                <h3>하위자 추천인</h3>
                <p>3,439</p>
              </li>
              <li>
                <h3>하위자 판매 노드 수</h3>
                <p>43,489,000</p>
              </li>
            </ul>
          </div>
        </section>

        {/* 내 판매기록 */}
        <SalesRecordList
          data={salesData}
          openIndex={openSalesIndex}
          handleToggle={handleSalesToggle}
          handleClickNewDealBtn={handleClickNewDealBtn}
        />

        {/* 초대 코드 리스트 */}
        <InviteCodeList
          handleClickInviteBtn={handleClickInviteBtn}
          inviteCodeList={inviteCodeList}
          formatDate={formatDate}
        />

        {/* 하위 수입자 리스트 */}
        <ReferralEarnings
          openIndex={openEarningsIndex}
          handleToggle={setOpenEarningsIndex}
        />
      </div>
      <Footer />
      {/* '지갑주소 등록' 선택 시 '지갑 등록' Modal 노출 */}
      {isOpenAddWalletModal && (
        <ModalWrap>
          <div className="modal modal-wallet">
            <div className="modal__content">
              <div className="modal__header">
                <h2>내 지갑주소 등록</h2>
                <button
                  type="button"
                  onClick={() => setIsOpenAddWalletModal(false)}
                >
                  <img src={closeBtn} alt="팝업 닫기" />
                </button>
              </div>
              <div className="modal__body">
                <InputField
                  id="walletAddress"
                  label="내 지갑주소"
                  type="text"
                  placeholder="지갑 주소를 입력해 주세요"
                  required
                  value={userWalletInput}
                  onChange={(e) => setUserWalletInput(e.target.value)}
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${
                    userWalletInput ? "" : "btn--disabled"
                  }`}
                  disabled={!userWalletInput}
                  onClick={() => handleSaveWallet(userWalletInput)}
                >
                  지갑주소 등록 <LoadingDots />
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
                <h2>내 지갑주소 수정</h2>
                <button type="button">
                  <img
                    src={closeBtn}
                    alt="팝업 닫기"
                    onClick={() => setIsOpenEditWalletModal(false)}
                  />
                </button>
              </div>
              <div className="modal__body">
                <InputField
                  id="userWalletAddress"
                  label="내 지갑주소"
                  type="text"
                  placeholder="지갑 주소를 입력해 주세요"
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
                    userWalletEdit ? "" : "btn--disabled"
                  }`}
                  disabled={!userWalletEdit}
                  onClick={() => handleSaveWallet(userWalletEdit)}
                >
                  지갑주소 수정 <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </ModalWrap>
      )}

      {/* '지갑주소 등록' 없이 '새 거래 등록' 선택 시 Confirm Modal 노출  */}
      {isOpenConfirmModal && (
        <ConfirmModal
          title="새로운 거래를 등록할 수 없습니다"
          message="내 지갑주소를 먼저 등록해 주세요!"
          buttonText="OK"
          onClose={() => setIsOpenConfirmModal(false)}
          onClick={() => setIsOpenConfirmModal(false)}
        />
      )}
      {isOpenNewDealModal && userWallet && (
        <FullModalWrap>
          <div className="modal modal-transaction">
            <div className="modal__content">
              <div className="modal__header">
                <h2>거래등록</h2>
                <button
                  type="button"
                  onClick={() => setIsOpenNewDealModal(false)}
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
                />
                <div className="twoway-inputField">
                  <div>
                    <label htmlFor="avgPrice">객단가</label>
                    <input
                      type="text"
                      id="avgPrice"
                      placeholder="객단가 입력"
                    />
                  </div>
                  <div>
                    <label htmlFor="salesCount">판매 개수</label>
                    <input
                      type="text"
                      id="salesCount"
                      placeholder="판매 노드 개수 입력"
                    />
                  </div>
                </div>
                <div className="total-amount-field">
                  <b>총 금액(자동계산)</b>
                  <p>
                    <span>0</span>USDT
                  </p>
                </div>
                <InputField
                  id="buyerWalletAddress"
                  label="구매자 지갑 주소"
                  type="text"
                  placeholder="노드를 받을 구매자의 지갑 주소를 입력해 주세요"
                  required
                />
                <InputField
                  id="addInput"
                  label="비고"
                  type="text"
                  placeholder="최대 30자까지 입력 가능합니다"
                  maxLength={30}
                />
              </div>
              <div className="modal__footer">
                <button className="btn btn-content-modal btn--disabled">
                  지갑주소 등록 <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </FullModalWrap>
      )}

      {/* '새 거래 등록' 완료 시 Confirm Modal 노출  */}
      {/* <ConfirmModal
    title="등록 완료"
    message="등록 후 승인요청 버튼을 꼭 클릭해 주세요. 노드 전송 및 정산금 입금은 영업일 기준 2~3일 소요됩니다."
    buttonText="확인"
    onClose={() => {}}
    /> */}

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
                    {/* <div className="share-setting__left">
                      <button type="button" className="share-option">
                        0%
                      </button>
                      <button type="button" className="share-option is-active">
                        5%
                      </button>
                      <button type="button" className="share-option">
                        10%
                      </button>
                      <button type="button" className="share-option">
                        15%
                      </button>
                    </div> */}
                    <div className="share-setting__left">
                      {[0, 5, 10, 15].map((value) => (
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
                  }`}
                  disabled={!isFormValid}
                  onClick={handleCreateInviteBtn}
                >
                  초대코드 생성 <LoadingDots />
                </button>
              </div>
            </div>
          </div>
        </FullModalWrap>
      )}

      {/* '초대코드 생성' 완료 시 Confirm Modal 노출  */}
      {/* <ConfirmModal
    title="초대코드 생성 완료"
    message="초대코드를 성공적으로 생성했습니다."
    buttonText="확인"
    onClose={() => {}}
    /> */}
    </>
  );
}

export default Dashboard;
