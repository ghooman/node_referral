import { Link } from 'react-router-dom';
import React, { useState } from 'react';
// compomnents
import HeaderBack from '../components/unit/HeaderBack';
import Footer from '../components/unit/Footer';
import LoadingDots from '../components/unit/LoadingDots';
import FullModalWrap from '../components/modal/FullModalWrap';
import ConfirmModal from '../components/modal/ConfirmModal';
import CopyButton from '../components/unit/CopyButton';
import SalesRecordList from '../components/dashboard/SalesRecordList';
import InputField from '../components/unit/InputField';
import Pagination from '../components/unit/Pagination';
// img
import arrowUpIcon from '../assets/images/icon-arrow-up.svg';
import arrowDownIcon from '../assets/images/icon-arrow-down.svg';

import '../styles/pages/SalesRecord.scss';
import '../components/dashboard/SalesRecordList.scss';

function SalesRecord() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };
  const data = [
  {
    buyer: '홍길동',
    count: 3,
    unitPrice: '50 USDT',
    total: '150 USDT',
    settlement: '100 USDT',
    date: '2025.07.14',
    status: '승인요청',
    statusType: 'request',
    wallet: '8687678678678678678687',
    memo: '테스트 메모',
    approveDate: '2025.07.15',
    completeDate: '2025.07.17',
  }
];

  return (
    <>
    <div className="layout">
        <HeaderBack />
        <div className="page-wrapper padding-del">
            <div className="sales-section">
                <div className='sales-section__record-tit'>
                    <h2>내 판매기록 전체보기</h2>
                    <span>총 <small>00</small>건</span>
                </div>
                <ul className='sales-section__record-list'>
                    <li>
                        <h3>나의 판매 수입</h3>
                        <p>3,284,224</p>
                    </li>
                    <li>
                        <h3>나의 판매 정산금</h3>
                        <p>1,864,392</p>
                    </li>
                    <li>
                        <h3>나의 판매 노드 수</h3>
                        <p>4,203</p>
                    </li>
                </ul>
                <button type='button' className='sales-section__btn'>새 거래 등록</button>
            </div>
            <div class="filter-group">
                <div class="filter-group__title">필터링</div>
                <div class="custom-select">
                    {/* custom-select에 is-open class 삽입 시 select option 노출 */}
                    <button type="button" class="custom-select__btn">
                        <span>전체</span>
                        <i class="custom-select__arrow"></i>
                    </button>
                    <ul class="custom-select__list">
                        <li class="is-selected">전체</li>
                        <li>승인요청</li>
                        <li>승인대기</li>
                        <li>승인취소</li>
                        <li>승인완료</li>
                        <li>정산대기</li>
                        <li>정산완료</li>
                    </ul>
                </div>
            </div>
            
            <section className="table-section">
                <div className="table-section-inner">

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
                    {(!data || data.length === 0) ? (
                        // 판매 기록이 없는 경우 
                        <div className="table-empty">판매 기록이 없습니다.</div>
                    ) : (
                        data.map((item, index) => (
                        <div className={`list-item ${openIndex === index ? 'open' : ''}`} key={index}>
                            <div className="list-item__row sales-record">
                            <div className="col">{item.buyer}</div>
                            <div className="col mobile-del">{item.count}</div>
                            <div className="col mobile-del">{item.unitPrice}</div>
                            <div className="col">{item.total}</div>
                            <div className="col">{item.settlement}</div>
                            <div className="col mobile-del">{item.date}</div>
                            {/* 상태 표시 */}
                            <div className="col">
                            <span className={`badge badge--${item.statusType}`}>{item.status}</span>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="col toggle-btn-box">
                            <button className="btn-line-cancel">취소</button>
                            <button
                                className={`toggle-btn ${openIndex === index ? 'rotate' : ''}`}
                                onClick={() => toggle(index)}
                            >
                                <img src={arrowDownIcon} alt="토글" />
                            </button>
                            </div>
                        </div>

                            {openIndex === index && (
                            <div className="list-item__detail">
                                <div className="list-item__detail__list">
                                <p>
                                    <b>지갑주소</b>
                                    <span>
                                    {item.wallet}
                                    <CopyButton textToCopy={item.wallet} />
                                    </span>
                                </p>
                                <p>
                                    <b>비고</b>
                                    <span>{item.memo}</span>
                                </p>
                                </div>
                                <div className="list-item__detail__list">
                                <p>
                                    <b>승인완료 날짜</b>
                                    <span>{item.approveDate}</span>
                                </p>
                                <p>
                                    <b>정산완료 날짜</b>
                                    <span>{item.completeDate}</span>
                                </p>
                                </div>
                            </div>
                            )}
                        </div>
                        ))
                    )}
                </div>
            </section>
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={(page) => console.log('Go to page', page)}
                />
            
        </div>
        <Footer />
    </div>

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
    </>

    
  )
}

export default SalesRecord