import { Link } from 'react-router-dom';
import React, { useState } from 'react';
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

function Dashboard() {
    const [openSalesIndex, setOpenSalesIndex] = useState(null);
    const [openInviteIndex, setOpenInviteIndex] = useState(null);
    const [openEarningsIndex, setOpenEarningsIndex] = useState(null);

    const salesData = [
  {
    buyer: '김첨지',
    count: 100,
    unitPrice: 3,
    total: 300,
    settlement: 180.15,
    date: '2025.06.02 17:48',
    status: '승인 요청',
    statusType: 'requested',
    wallet: '0x8687****7868786878687',
    memo: '구매한 사람에 대한 메모 최대 30자',
    approveDate: '2025.06.03 13:00',
    completeDate: '-',
  },
  {
    buyer: '홍길동',
    count: 20,
    unitPrice: 5,
    total: 100,
    settlement: 70.5,
    date: '2025.07.01 10:20',
    status: '승인 대기',
    statusType: 'ready',
    wallet: '0x7788****1234567890',
    memo: '2차 구매자',
    approveDate: '-',
    completeDate: '-',
  }
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
    <div className='page-wrapper dashboard-wrapper'>
        <div className="user-section">
            <p className='user-section__email'>kimchumzi@mob.com</p>
            <ul className='user-section__wallet'>
                <li>
                    <span>나의 지분</span>
                    <strong>50%</strong>
                </li>
                <li>
                    <span>본사 입금 지갑주소</span>
                    <div className='user-section__wallet__copy-com'>
                        <strong>4932....4389</strong>
                        <CopyButton textToCopy="4932....4389" />
                    </div>
                </li>
                <li>
                    <span>내 지갑주소</span>
                    {/* 지갑주소를 보유한 경우 */}
                    {/* <div className='user-section__wallet__copy-com'>
                        <strong>4932....4389</strong>
                        <CopyButton textToCopy="4932....4389" />
                        <button type='button'><img src={penIcon} alt="수정" /></button>
                    </div> */}

                    {/* 지갑주소를 보유하지 않은 경우 '지갑주소 등록' 버튼만 노출 */}
                    <button type='button' className='btn-register'>지갑주소 등록</button>
                </li>
            </ul>
        </div>

        {/* 대시보드 */}
        <section className='dash-section'>
            <h2 className='dash-section__tit'>Dashboard</h2>
            <div className='dash-section__txt'>
                <ul className='dash-section__txt__board'>
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
                <ul className='dash-section__txt__list'>
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
        />

        {/* 초대 코드 리스트 */}
        <InviteCodeList />

        {/* 하위 수입자 리스트 */}
        <ReferralEarnings
        openIndex={openEarningsIndex}
        handleToggle={setOpenEarningsIndex}
        />
    </div>
    <Footer />
    {/* '지갑주소 등록' 선택 시 '지갑 등록' Modal 노출 */}
    {/* <ModalWrap>
        <div className="modal modal-wallet">
            <div className="modal__content">
                <div className="modal__header">
                    <h2>내 지갑주소 등록</h2>
                    <button type="button">
                        <img src={closeBtn} alt="팝업 닫기" />
                    </button>
                </div>
                <div className='modal__body'>
                    <InputField
                        id="walletAddress"
                        label="내 지갑주소"
                        type="text"
                        placeholder="지갑 주소를 입력해 주세요"
                        required
                    />
                </div>
                <div className="modal__footer">
                    <button className="btn btn-content-modal btn--disabled">
                        지갑주소 등록 <LoadingDots />
                    </button>
                </div>
            </div>
        </div>
    </ModalWrap> */}
    
    {/* 지갑을 등록한 경우 지갑 주소 우측에 연필 아이콘 클릭 시 '내 지갑주소 수정' Modal 노출 */}
    {/* <ModalWrap>
        <div className="modal modal-wallet">
            <div className="modal__content">
                <div className="modal__header">
                    <h2>내 지갑주소 수정</h2>
                    <button type="button">
                        <img src={closeBtn} alt="팝업 닫기" />
                    </button>
                </div>
                <div className='modal__body'>
                    <InputField
                        id="userWalletAddress"
                        label="내 지갑주소"
                        type="text"
                        placeholder="지갑 주소를 입력해 주세요"
                        defaultValue="2938293829382938292"
                        required
                        // 사용자의 지갑 주소가 입력 필드에 자동으로 기입되도록 처리
                    />
                </div>
                <div className="modal__footer">
                    <button className="btn btn-content-modal btn--disabled">
                        지갑주소 수정 <LoadingDots />
                    </button>
                </div>
            </div>
        </div>
    </ModalWrap> */}

    {/* '지갑주소 등록' 없이 '새 거래 등록' 선택 시 Confirm Modal 노출  */}
    {/* <ConfirmModal
    title="새로운 거래를 등록할 수 없습니다"
    message="내 지갑주소를 먼저 등록해 주세요!"
    buttonText="OK"
    onClose={() => {}}
    /> */}

    {/* '새 거래 등록' 선택 시 '거래등록' Modal 노출 */}
    {/* <FullModalWrap>
        <div className="modal modal-transaction">
            <div className="modal__content">
                <div className="modal__header">
                    <h2>거래등록</h2>
                    <button type="button">
                        <img src={closeBtn} alt="팝업 닫기" />
                    </button>
                </div>
                <div className='modal__body'>
                    <InputField
                        id="buyerName"
                        label="구매자명"
                        type="text"
                        placeholder="구매자명을 입력해 주세요"
                        required
                    />
                    <div className='twoway-inputField'>
                        <div>
                            <label htmlFor="avgPrice">객단가</label>
                            <input type="text" id="avgPrice" placeholder='객단가 입력' />
                        </div>
                        <div>
                            <label htmlFor="salesCount">판매 개수</label>
                            <input type="text" id="salesCount" placeholder='판매 노드 개수 입력' />
                        </div>
                    </div>
                    <div className='total-amount-field'>
                        <b>총 금액(자동계산)</b>
                        <p><span>0</span>USDT</p>
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
    </FullModalWrap> */}

    {/* '새 거래 등록' 완료 시 Confirm Modal 노출  */}
    {/* <ConfirmModal
    title="등록 완료"
    message="등록 후 승인요청 버튼을 꼭 클릭해 주세요. 노드 전송 및 정산금 입금은 영업일 기준 2~3일 소요됩니다."
    buttonText="확인"
    onClose={() => {}}
    /> */}

    {/* '초대코드 생성' 선택 시 '초대코드 생성' Modal 노출 */}
    {/* <FullModalWrap>
        <div className="modal modal-create-code">
            <div className="modal__content">
                <div className="modal__header">
                    <h2>초대코드 생성</h2>
                    <button type="button">
                        <img src={closeBtn} alt="팝업 닫기" />
                    </button>
                </div>
                <div className='modal__body'>
                    <div className='user-share'>
                        <div>
                            <b>나의 지분</b>
                            <span>45%</span>
                        </div>
                        <div>
                            <b>분리할 지분</b>
                            <span>5%</span>
                        </div>
                    </div>
                    <div className="share-setting">
                        <p className="share-setting__label">지분 설정</p>
                        <div className="share-setting__options" role="radiogroup" aria-label="지분 설정">
                            <div className='share-setting__left'>
                                <button type="button" className="share-option">0%</button>
                                <button type="button" className="share-option is-active">5%</button>
                                <button type="button" className="share-option">10%</button>
                                <button type="button" className="share-option">15%</button>
                            </div>
                            <button type="button" className="share-option is-disabled" disabled>≤ nn %</button>
                        </div>
                    </div>
                    <InputField
                        id="userNickName"
                        label="닉네임"
                        type="text"
                        placeholder="닉네임을 입력해 주세요"
                        required
                    />
                </div>
                <div className="modal__footer">
                    <button className="btn btn-content-modal btn--disabled">
                        지갑주소 등록 <LoadingDots />
                    </button>
                </div>
            </div>
        </div>
    </FullModalWrap> */}

    {/* '초대코드 생성' 완료 시 Confirm Modal 노출  */}
    {/* <ConfirmModal
    title="초대코드 생성 완료"
    message="초대코드를 성공적으로 생성했습니다."
    buttonText="확인"
    onClose={() => {}}
    /> */}
    </>
  )
}

export default Dashboard