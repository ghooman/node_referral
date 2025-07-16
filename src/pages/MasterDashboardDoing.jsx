import { Link } from 'react-router-dom';
import React, { useState } from 'react';
// compomnents
import Header from '../components/unit/Header';
import Footer from '../components/unit/Footer';
import Pagination from '../components/unit/Pagination';
import CopyButton from '../components/unit/CopyButton';
import TwowayConfirmModal from '../components/modal/TwowayConfirmModal';
// img
import SearchIcon from '../assets/images/icon-search.svg';
import arrowDownIcon from '../assets/images/icon-arrow-down.svg';
import arrowRightIcon from '../assets/images/icon-arrow-right.svg';
// style
import '../styles/pages/MasterDashboard.scss';

function MasterDashboardDoing() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
    };
    const data = [
    {
        status: '승인대기',
        wallet: '0xDdDd...DdDd',
        unitPrice: 500,
        quantity: 1,
        total: 500,
        toWallet: '0xDdDd...DdDd',
        emailList: ['kimchumji@mob.com', 'kimchumji@mob.com', 'kimchumji@mob.com'],
        정산리스트: [
        {
            email: 'kimchumji@mob.com',
            지분: '50%',
            정산금: '250',
            정산상태: '정산대기'
        },
        {
            email: 'partner@mob.com',
            지분: '50%',
            정산금: '250',
            정산상태: '정산완료'
        }
        ]
    },
      {
        status: '승인취소',
        wallet: '0xDdDd...DdDd',
        unitPrice: 500,
        quantity: 1,
        total: 500,
        toWallet: '0xDdDd...DdDd',
        emailList: ['kimchumji@mob.com', 'kimchumji@mob.com', 'kimchumji@mob.com'],
        정산리스트: [
        {
            email: 'kimchumji@mob.com',
            지분: '50%',
            정산금: '250',
            정산상태: '정산대기'
        },
        {
            email: 'partner@mob.com',
            지분: '50%',
            정산금: '250',
            정산상태: '정산완료'
        }
        ]
    }
    ];

  return (
    <>
    <div className="layout">
        <Header />
        <div className="page-wrapper masterdashboard-wrapper">
            <ul className='tab-ui'>
                <li className='selected'>
                    <Link to="/MasterDashboardDoing">
                        판매승인/정산
                    </Link>
                </li>
                <li>
                    <Link to="/MasterDashboardDone">
                        정산기록
                    </Link>
                </li>
            </ul>
            
            {/* 대시보드 */}
            <section className='dash-section'>
                <h2 className='dash-section__tit'>Dashboard</h2>
                <div className='dash-section__txt'>
                    <ul className='dash-section__txt__board'>
                        <li>
                            <h3>전체 거래건 수</h3>
                            <p>300</p>
                        </li>
                        <li>
                            <h3>정산완료</h3>
                            <p>282</p>
                        </li>
                        <li>
                            <h3>정산대기</h3>
                            <p>10</p>
                        </li>
                        <li>
                            <h3>승인완료</h3>
                            <p>5</p>
                        </li>
                        <li>
                            <h3>승인취소</h3>
                            <p>3</p>
                        </li>
                        <li>
                            <h3>승인대기</h3>
                            <p>0</p>
                        </li>
                        
                    </ul>
                </div>
            </section>
            <div className='filter-section'>
                <div className="filter-group">
                    <div className="filter-group__title">정렬</div>
                    <div className="custom-select">
                        {/* custom-select에 is-open class 삽입 시 select option 노출ㅋ */}
                        <button type="button" className="custom-select__btn">
                            <span>최신순</span>
                            <i className="custom-select__arrow"></i>
                        </button>
                        <ul className="custom-select__list">
                            <li className="is-selected">최신순</li>
                            <li>최신순</li>
                            <li>오래된순</li>
                            <li>지분 오름차순</li>
                            <li>지분 내림차순</li>
                            <li>할당인원 오름차순</li>
                            <li>할당인원 내림차순</li>
                        </ul>
                    </div>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="이메일 및 지갑주소로 검색"
                        className="search-bar__input"
                    />
                    <button type="button" className="search-bar__btn">
                        <img src={SearchIcon} alt="검색" aria-hidden="true" className='icon-search' />
                        <span className="sr-only">검색</span>
                    </button>
                </div>
            </div>
            <div className="table-section">
                <div className='table-section-inner'>
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
                    {data.map((item, index) => (
                    <div key={index} className={`list-item ${openIndex === index ? 'open' : ''}`}>
                        <div className="list-item__row">
                        <div className={`col status-col
                                ${item.status === '승인대기' ? 'status--pending' : ''}
                                ${item.status === '승인취소' ? 'status--cancelled' : ''}
                            `}
                            >
                            {item.status}</div>
                        <div className="col wallet-copy-com">
                            {item.wallet}
                            <CopyButton textToCopy={item.wallet} />
                        </div>
                        <div className="col">{item.unitPrice}</div>
                        <div className="col">{item.quantity}</div>
                        <div className="col">{item.total}</div>
                        <div className="col wallet-copy-com">
                            {item.toWallet}
                            <CopyButton textToCopy={item.toWallet} />    
                        </div>
                        <div className="col col--action toggle-btn-box">
                            {/* 상태값 승인대기인 경우 twoway-btn 노출 */}
                            {item.status === '승인대기' && (
                                <div className="twoway-btn-box --pending">
                                    <button className="twoway-btn btn--blue">승인</button>
                                    <button className="twoway-btn btn--red">취소</button>
                                </div>
                            )}
                            {item.status === '승인취소' && (
                                <div className="toway-txt-box --cancelled">
                                    <p>승인 취소</p>
                                    <small>YYYY. MM. DD HH:MM</small>
                                </div>
                            )}
                            {/* 정산완료 */}
                            {item.status === '승인완료' && (
                                <div className="toway-txt-box --cancelled">
                                    <p>승인 완료</p>
                                    <small>YYYY. MM. DD HH:MM</small>
                                </div>
                            )}
                            <button
                                className={`toggle-btn ${openIndex === index ? 'rotate' : ''}`}
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
                                <div className="col">정산상태</div>
                            </div>

                            {item.정산리스트?.map((user, i) => (
                                <div className="info-row" key={i}>
                                <div className="col col--email">
                                    <Link to="/OtherSalesRecord">
                                        <span>{user.email}</span>
                                        <img src={arrowRightIcon} alt="자세히 보기" className="arrow-icon" />
                                    </Link>
                                </div>
                                <div className="col">{user.지분}</div>
                                <div className="col">{user.정산금}</div>
                                <div className="col settlement-btn-box">
                                {user.정산상태 === '정산대기' ? (
                                    <button className="btn--blue-line">정산</button>
                                ) : (
                                    <span>YYYY. MM. DD HH:MM</span>
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
            <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={(page) => console.log('Go to page', page)}
                />
        </div>
        <Footer />
        {/* table-section 내 '취소' 선택 시 Confirm Modal 노출  */}
        {/* <TwowayConfirmModal
            title="해당 거래를 취소처리 하시겠습니까?"
            message="거래 요청을 취소합니다."
            confirmText="OK"
            cancelText="Cancel"
            /> */}
    </div>
    </>
  )
}

export default MasterDashboardDoing