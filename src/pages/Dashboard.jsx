// Components
import Header from '../components/unit/Header';
import Footer from '../components/unit/Footer';
import LoadingDots from '../components/unit/LoadingDots';
import ModalWrap from '../components/modal/ModalWrap';
import FullModalWrap from '../components/modal/FullModalWrap';
import ConfirmModal from '../components/modal/ConfirmModal';
import CopyButton from '../components/unit/CopyButton';
import SalesRecordList from '../components/dashboard/SalesRecordList';
import InviteCodeList from '../components/dashboard/InviteCodeList';
import ReferralEarnings from '../components/dashboard/ReferralEarnings';
import InputField from '../components/unit/InputField';
// img
import penIcon from '../assets/images/icon-pen.svg';
import arrowDownIcon from '../assets/images/icon-arrow-down.svg';
import arrowUpIcon from '../assets/images/icon-arrow-up.svg';
import closeBtn from '../assets/images/icon-close.svg';
// style
import '../styles/pages/Dashboard.scss';
// 외부 라이브러리 및 패키지
import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { use, useState, useEffect } from 'react';

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function Dashboard() {
  const [openSalesIndex, setOpenSalesIndex] = useState(null);
  const [openInviteIndex, setOpenInviteIndex] = useState(null);
  const [openEarningsIndex, setOpenEarningsIndex] = useState(null);

  //---- 공통 상태 ----------------------------------------------------
  // 사용자 정보 상태
  const [userName, setUserName] = useState('');
  const [userShare, setUserShare] = useState('');
  const [userWallet, setUserWallet] = useState('');
  const [userOfficeWallet, setUserOfficeWallet] = useState('');

  const [userWalletInput, setUserWalletInput] = useState('');
  const [userWalletEdit, setUserWalletEdit] = useState('');

  const userToken = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');
  const isMaster = userRole === 'master';

  // 버튼 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 로딩
  const [isPageLoading, setIsPageLoading] = useState(false);

  //---- 지갑주소 상태 ----------------------------------------------------
  // 지갑주소 등록 모달 오픈
  const [isOpenAddWalletModal, setIsOpenAddWalletModal] = useState(false);
  // 지갑주소 수정 모달 오픈
  const [isOpenEditWalletModal, setIsOpenEditWalletModal] = useState(false);

  //---- 대시보드 상태 ----------------------------------------------------
  // 상단 4개 (total)
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSettlement, setTotalSettlement] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalSoldNode, setTotalSoldNode] = useState(0);

  // 중단 4개 (나의)
  const [myRevenue, setMyRevenue] = useState(0);
  const [mySettlement, setMySettlement] = useState(0);
  const [myReferrals, setMyReferrals] = useState(0);
  const [mySoldNode, setMySoldNode] = useState(0);

  // 하단 4개 (하위)
  const [downRevenue, setDownRevenue] = useState(0);
  const [downSettlement, setDownSettlement] = useState(0);
  const [downReferrals, setDownReferrals] = useState(0);
  const [downSoldNode, setDownSoldNode] = useState(0);

  //---- 새 거래 등록 상태 ----------------------------------------------------
  // 새 거래 등록 정보
  const [newDealUser, setNewDealUser] = useState('');
  const [newDealPerPrice, setNewDealPerPrice] = useState('');
  const [newDealNumber, setNewDealNumber] = useState('');
  const [newDealTotalAmount, setNewDealTotalAmount] = useState(0);
  const [newDealWallet, setNewDealWallet] = useState('');
  const [newDealNote, setNewDealNote] = useState('');
  const [isNewDealValid, setIsNewDealValid] = useState(false);
  // 새 거래 등록 모달 오픈
  const [isOpenNewDealModal, setIsOpenNewDealModal] = useState(false);
  // 컨펌 모달 오픈 (새 거래 등록 눌렀을 때 지갑 주소 없을 경우 나오는 모달)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  // 새 거래 등록 생성한 리스트 상태
  const [newDealList, setNewDealList] = useState([]);
  // 새 거래 등록 생성 시 성공 모달
  const [isNewDealCreateSuccess, setIsNewDealCreateSuccess] = useState(false);

  //----- 초대코드 상태 ----------------------------------------------------
  // 초대 코드 모달 오픈
  const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);
  // 초대코드 생성 시, 분리할 지분 (버튼)
  const [selectedShare, setSelectedShare] = useState('0'); // 기본값 0%
  const [customShare, setCustomShare] = useState('');
  // 초대코드 생성 시, 닉네임 설정
  const [nickname, setNickname] = useState('');
  // 초대코드 생성한 리스트 상태
  const [inviteCodeList, setInviteCodeList] = useState([]);
  // 초대코드 생성 시 성공 모달
  const [isInviteCodeCreateSuccess, setIsInviteCodeCreateSuccess] = useState(false);

  //----- 하위 레퍼럴 활동현황 상태 ----------------------------------------------------
  const [downReferralActive, setDownReferralActive] = useState([]);

  //---- 공통 ----------------------------------------------------
  // 사용자 정보 가져오는 함수
  const userInfo = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/user/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log('API에서 받아온 사용자 정보', res.data);
      setUserName(res.data.username);
      setUserShare(res.data.share);
      setUserWallet(res.data.wallet_address);
      setUserOfficeWallet(res.data.deposit_wallet_address);
    } catch (error) {
      console.error('사용자 정보 가져오는 함수 error입니당', error);
    }
  };
  // userToken이 존재하면 사용자 정보 호출하기!
  useEffect(() => {
    if (userToken) {
      userInfo();
    }
  }, [userToken]);
  // 로그인 후 첫 진입 시, 각 리스트 불러오기!
  useEffect(() => {
    if (userToken) {
      handleGetDashboardData();
      fetchInviteCodeList();
      fetchNewDealList();
      handleDownReferralActiveList();
    }
  }, []);
  // 날짜 포맷팅
  const formatDate = isoString => {
    const raw = new Date(isoString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // "2025. 07. 19. 15:16" → "2025. 07. 19 15:16"
    return raw.replace(/(\d{2})\.\s(\d{2})\.\s(\d{2})\.\s/, '$1. $2. $3 ');
  };
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const pad = num => String(num).padStart(2, '0');

    const dateStr = `${startDate.getFullYear()}. ${pad(startDate.getMonth() + 1)}. ${pad(
      startDate.getDate()
    )}`;
    const startTime = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
    const endTime = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

    return `${dateStr} ${startTime} - ${endTime}`;
  };
  // 각 리스트 5개만 보여주기
  const sliceList5 = (list, count = 5) => {
    if (!Array.isArray(list)) return [];
    return list.slice(0, count);
  };

  // 숫자 포맷 함수
  const formatNumber = num => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString('en-US'); // "1,000", "50,000" 형태
  };

  //---- 지갑주소 ----------------------------------------------------
  // 지갑주소 클릭 함수
  const handleClickAddWalletBtn = async () => {
    setIsOpenAddWalletModal(true);
  };
  // 지갑주소 수정 클릭 함수
  const handleClickEditWalletBtn = async () => {
    setUserWalletEdit(userWallet);
    setIsOpenEditWalletModal(true);
    console.log('지갑주소 수정 함수입니당!');
    console.log('userWalletEdit', userWalletEdit);
    console.log('userWalletInput', userWalletInput);
    console.log('userWallet', userWallet);
  };
  // 지갑주소 등록하는 함수
  const handleSaveWallet = async finalWallet => {
    setIsLoading(true);
    try {
      console.log('서버에 보내는 지갑 주소는?!', finalWallet);
      await axios.post(`${serverAPI}/api/user/wallet/address`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },

        params: {
          wallet_address: finalWallet.trim(),
        },
      });
      console.log('지갑주소 등록/수정 완료~!', finalWallet);
      setUserWallet(finalWallet.trim()); // 여기서 지갑주소 업데이트!
      setUserWalletInput(''); // 등록용 초기화
      setUserWalletEdit(''); // 수정용 초기화
      setIsOpenAddWalletModal(false);
      setIsOpenEditWalletModal(false);
      setIsLoading(false);
      userInfo(); // 사용자 정보 새롭게 갱신하기!
    } catch (error) {
      console.error('지갑주소 등록/수정 error입니당', error);
      setIsLoading(false);
    }
  };
  // 지갑 주소 포맷팅 함수 (앞뒤 4글자씩 짜르기 0x00....0000)
  const formatWalletAddress = address => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  //---- 대시보드 ----------------------------------------------------
  // 대시보드 정보 값 가져오는 함수
  const handleGetDashboardData = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log('API에서 받아온 대시보드 정보', res.data);
      // 상단 4개 (total)
      setTotalRevenue(res.data.total_revenue);
      setTotalSettlement(res.data.total_settlement);
      setTotalReferrals(res.data.total_referrals);
      setTotalSoldNode(res.data.total_sold_nodes);
      // 중단 4개 (나의)
      setMyRevenue(res.data.my_sales_revenue);
      setMySettlement(res.data.my_settlement);
      setMyReferrals(res.data.my_referrals);
      setMySoldNode(res.data.my_sold_nodes);
      // 하단 4개 (하위)
      setDownRevenue(res.data.downline_sales_revenue);
      setDownSettlement(res.data.downline_settlement);
      setDownReferrals(res.data.downline_referrals);
      setDownSoldNode(res.data.downline_sold_nodes);
    } catch (error) {
      console.error('대시보드 정보 값 가져오는 함수 error입니당', error);
    }
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
  const handleBuyerNameChange = e => {
    const value = e.target.value;
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]*$/; // 한글/영문만 허용

    if (regex.test(value) && value.length <= 8) {
      setNewDealUser(value);
    }
  };
  // 새 거래등록 글자갯수 포맷팅 (비고)
  const handleNoteChange = e => {
    const value = e.target.value;
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s.,!?()'"-]*$/; // 문장 기호도 허용하면 이렇게

    if (regex.test(value) && value.length <= 30) {
      setNewDealNote(value);
    }
  };
  // 새 거래등록 필드 초기화
  const resetNewDealFields = () => {
    setNewDealUser('');
    setNewDealPerPrice('');
    setNewDealNumber('');
    setNewDealTotalAmount(0);
    setNewDealWallet('');
    setNewDealNote('');
    setIsNewDealValid(false); // 등록 버튼 비활성화 초기화
  };

  // 새 거래등록 최종 등록하는 함수
  const handleNewDealSubmit = async () => {
    setIsLoading(true);
    try {
      console.log('서버로 보내는 거래등록 내용 모음!');
      console.log('newDealUser', newDealUser);
      console.log('newDealPerPrice', newDealPerPrice);
      console.log('newDealNumber', newDealNumber);
      console.log('newDealTotalAmount', newDealTotalAmount);
      console.log('newDealWallet', newDealWallet);
      console.log('newDealNote', newDealNote);
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
      console.log('새 거래등록 서버 전달 완료~!');
      await fetchNewDealList();
      resetNewDealFields(); // 입력 필드 초기화
      setIsLoading(false);
      setIsOpenNewDealModal(false);
      setIsNewDealCreateSuccess(true);
    } catch (error) {
      console.error('새 거래등록 최종 등록하는 함수 error입니당', error);
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
          page: 1,
          limit: 20,
          // state: "state" // 선택적으로 사용 가능
        },
      });
      console.log('전체 응답', res.data);
      const list = res.data.data_list;
      setNewDealList(list);
    } catch (error) {
      console.error('새 거래등록 리스트 가져오기 실패', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  //---- 초대코드 ----------------------------------------------------
  // 초대코드 클릭 함수
  const handleClickInviteBtn = async () => {
    setIsOpenInviteModal(true);
  };
  // 초대코드 지분 선택 되었는지 확인 (닉네임은 선택값)
  const isFormValid = selectedShare !== '';

  // 초대코드 한글/영어/숫자 + 최대 10자 제한
  const handleNicknameChange = e => {
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
          nick_name: nickname.trim() === '' ? '-' : nickname.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log('share', Number(selectedShare));
      console.log('nickname', nickname.trim() === '' ? '-' : nickname);
      console.log('초대코드 생성 성공');
      // ✅ 응답 값 확인
      console.log('status:', res.data.status);
      await fetchInviteCodeList(); // 생성 후 최신 데이터 확인
      setIsLoading(false);
      setIsOpenInviteModal(false);
      setIsInviteCodeCreateSuccess(true);
    } catch (error) {
      console.error('초대코드 생성 에러', error);
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
          page: 1,
          limit: 20,
          // sort_by: "create_dt" // 선택적으로 사용 가능
        },
      });

      // 전체 응답 보기
      console.log('전체 응답', res.data);

      // 초대코드 리스트만 보기
      const list = res.data.data_list;
      console.log('초대코드 리스트:', list);
      setInviteCodeList(list);
    } catch (error) {
      console.error('초대코드 리스트 가져오기 실패:', error);
      if (error.response) {
        console.log('응답 에러:', error.response.status, error.response.data);
      } else {
        console.log('기타 에러:', error.message);
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

  //----- 하위 레퍼럴 활동현황 ----------------------------------------------------
  const handleDownReferralActiveList = async () => {
    try {
      setIsPageLoading(true);
      const res = await axios.get(`${serverAPI}/api/sales/referrals/income/list`, {
        params: {
          page: 1,
          limit: 5,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log('하위 레퍼럴 활동현황 받아오기 완료!', res.data.data_list);
      setDownReferralActive(res.data.data_list);
    } catch (error) {
      console.error('하위 레퍼럴 활동현황 error입니당', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSalesToggle = index => {
    setOpenSalesIndex(prev => (prev === index ? null : index));
  };

  const handleInviteToggle = index => {
    setOpenInviteIndex(prev => (prev === index ? null : index));
  };

  const handleEarningsToggle = index => {
    setOpenEarningsIndex(prev => (prev === index ? null : index));
  };
  return (
    <>
      <Header />
      <div className="page-wrapper dashboard-wrapper">
        <div className="user-section">
          <p className="user-section__email">{userName}</p>
          <ul className="user-section__wallet">
            <li>
              <span>My Share</span>
              <strong>{userShare}%</strong>
            </li>
            <li>
              <span>Company Wallet</span>
              <div className="user-section__wallet__copy-com">
                <strong>{formatWalletAddress(userOfficeWallet)}</strong>
                {/* <strong>0x00....0000</strong> */}
                <CopyButton textToCopy={userOfficeWallet} />
              </div>
            </li>
            <li>
              <span>My Wallet Address</span>
              {!userWallet ? (
                <button type="button" className="btn-register" onClick={handleClickAddWalletBtn}>
                  Register Wallet Address
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
                <h3>Total Revenue (USDT)</h3>
                <p>{formatNumber(totalRevenue)}</p>
              </li>
              <li>
                <h3>Total Settlements (USDT)</h3>
                <p>{formatNumber(totalSettlement)}</p>
              </li>
              <li>
                <h3>Total Referrals</h3>
                <p>{formatNumber(totalReferrals)}</p>
              </li>
              <li>
                <h3>Total Sold Nodes (NODE)</h3>
                <p>{formatNumber(totalSoldNode)}</p>
              </li>
            </ul>
            <ul className="dash-section__txt__list">
              <li>
                <h3>My Sales Revenue</h3>
                <p>{formatNumber(myRevenue)}</p>
              </li>
              <li>
                <h3>My Sales Settlements</h3>
                <p>{formatNumber(mySettlement)}</p>
              </li>
              <li>
                <h3>My Referrals</h3>
                <p>{formatNumber(myReferrals)}</p>
              </li>
              <li>
                <h3>My Sold Nodes</h3>
                <p>{formatNumber(mySoldNode)}</p>
              </li>
              <li>
                <h3>Sub-affiliate Sales Revenue</h3>
                <p>{formatNumber(downRevenue)}</p>
              </li>
              <li>
                <h3>Sub-affiliate Settlements</h3>
                <p>{formatNumber(downSettlement)}</p>
              </li>
              <li>
                <h3>Sub-affiliate Referrals</h3>
                <p>{formatNumber(downReferrals)}</p>
              </li>
              <li>
                <h3>Sub-affiliate Sold Nodes</h3>
                <p>{formatNumber(downSoldNode)}</p>
              </li>
            </ul>
          </div>
        </section>

        {/* 내 판매기록 */}
        <SalesRecordList
          // data={salesData}
          openIndex={openSalesIndex}
          handleToggle={handleSalesToggle}
          handleClickNewDealBtn={handleClickNewDealBtn}
          newDealList={newDealList}
          setNewDealList={setNewDealList}
          fetchNewDealList={fetchNewDealList}
          formatDate={formatDate}
          sliceList5={sliceList5}
          isPageLoading={isPageLoading}
          formatNumber={formatNumber}
        />

        {/* 초대 코드 리스트 */}
        <InviteCodeList
          handleClickInviteBtn={handleClickInviteBtn}
          inviteCodeList={inviteCodeList}
          formatDate={formatDate}
          sliceList5={sliceList5}
          isPageLoading={isPageLoading}
          formatNumber={formatNumber}
        />

        {/* 하위 수입자 리스트 */}
        <ReferralEarnings
          openIndex={openEarningsIndex}
          handleToggle={setOpenEarningsIndex}
          downReferralActive={downReferralActive}
          sliceList5={sliceList5}
          isPageLoading={isPageLoading}
          formatNumber={formatNumber}
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
                <button type="button" onClick={() => setIsOpenAddWalletModal(false)}>
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
                  onChange={e => setUserWalletInput(e.target.value)}
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${userWalletInput ? '' : 'btn--disabled'} ${
                    isLoading ? 'btn--loading' : ''
                  }`}
                  disabled={!userWalletInput}
                  onClick={() => handleSaveWallet(userWalletInput)}
                >
                  {isLoading ? '지갑주소 등록 중' : '지갑주소 등록'}
                  <LoadingDots />
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
                <h2>Edit My Wallet Address</h2>
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
                  label="My Wallet Address"
                  type="text"
                  placeholder="Please enter your wallet address"
                  defaultValue="2938293829382938292"
                  required
                  value={userWalletEdit}
                  onChange={e => setUserWalletEdit(e.target.value)}
                  // 사용자의 지갑 주소가 입력 필드에 자동으로 기입되도록 처리
                />
              </div>
              <div className="modal__footer">
                <button
                  className={`btn btn-content-modal ${
                    !userWalletEdit || userWalletEdit.trim() === userWallet ? 'btn--disabled' : ''
                  } ${isLoading ? 'btn--loading' : ''}`}
                  disabled={!userWalletEdit || userWalletEdit.trim() === userWallet}
                  onClick={() => handleSaveWallet(userWalletEdit)}
                >
                  {isLoading ? 'Edit Wallet Address' : 'Edit Wallet Address'} <LoadingDots />
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
                      onChange={e => setNewDealPerPrice(e.target.value)}
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
                      onChange={e => setNewDealNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="total-amount-field">
                  <b>총 금액(자동계산)</b>
                  <p>
                    <span>{newDealTotalAmount.toLocaleString()}</span>
                    USDT
                  </p>
                </div>
                <InputField
                  id="buyerWalletAddress"
                  label="구매자 지갑 주소"
                  type="text"
                  placeholder="노드를 받을 구매자의 지갑 주소를 입력해 주세요"
                  required
                  value={newDealWallet}
                  onChange={e => setNewDealWallet(e.target.value)}
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
                  className={`btn btn-content-modal ${isNewDealValid ? '' : 'btn--disabled'} ${
                    isLoading ? 'btn--loading' : ''
                  }`}
                  disabled={!isNewDealValid}
                  onClick={handleNewDealSubmit}
                >
                  {isLoading ? '거래등록 중' : '거래등록 완료'} <LoadingDots />
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

      {/* '초대코드 생성' 선택 시 '초대코드 생성' Modal 노출 */}
      {isOpenInviteModal && (
        <FullModalWrap>
          <div className="modal modal-create-code">
            <div className="modal__content">
              <div className="modal__header">
                <h2>초대코드 생성</h2>
                <button type="button" onClick={() => setIsOpenInviteModal(false)}>
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
                  <div className="share-setting__options" role="radiogroup" aria-label="지분 설정">
                    <div className="share-setting__left">
                      {shareOptions.map(value => (
                        <button
                          key={value}
                          type="button"
                          className={`share-option ${
                            selectedShare === String(value) ? `is-active` : ''
                          }`}
                          onClick={() => {
                            setSelectedShare(String(value));
                            setCustomShare(''); // 직접 입력값 초기화
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
                      onChange={e => {
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
                  className={`btn btn-content-modal ${isFormValid ? '' : 'btn--disabled'} ${
                    isLoading ? 'btn--loading' : ''
                  }`}
                  disabled={!isFormValid}
                  onClick={handleCreateInviteBtn}
                >
                  {isLoading ? '초대코드 생성 중' : '초대코드 생성'}
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

export default Dashboard;
