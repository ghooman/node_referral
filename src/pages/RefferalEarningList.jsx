import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// compomnents
import HeaderBack from '../components/unit/HeaderBack';
import Footer from '../components/unit/Footer';
import InputField from '../components/unit/InputField';
import Pagination from '../components/unit/Pagination';

// img
import arrowDownIcon from '../assets/images/icon-arrow-down.svg';
import arrowUpIcon from '../assets/images/icon-arrow-up.svg';
import arrowRightIcon from '../assets/images/icon-arrow-right.svg';

// style
import '../components/dashboard/ReferralEarnings.scss';

function RefferalEarningList() {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (callback) => {
    setOpenIndex(typeof callback === 'function' ? callback : callback);
    };
    const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
    };
    const data = [
    {
      id: 0,
      status: '승인요청',
      객단가: 1,
      개수: 500,
      총금액: 500,
      내정산금: 250,
      정산리스트: [
        { email: 'kimchumzi@mob.com', 지분: '50%', 정산금: 250, 정산상태: '대기' },
        { email: 'kimchumji@mob.com', 지분: '10%', 정산금: 50, 정산상태: '대기' },
        { email: 'kimcheomji@mob.com', 지분: '3%', 정산금: 15, 정산상태: '대기' },
      ],
    },
    {
      id: 1,
      status: '승인대기',
      객단가: 1,
      개수: 500,
      총금액: 500,
      내정산금: 250,
      정산리스트: [
        { email: 'kimchumzi@mob.com', 지분: '50%', 정산금: 250, 정산상태: '대기' },
        { email: 'kimchumji@mob.com', 지분: '10%', 정산금: 50, 정산상태: '대기' },
        { email: 'kimcheomji@mob.com', 지분: '3%', 정산금: 15, 정산상태: '대기' },
      ],
    },
  ];

  return (
    <>
    <div className="layout">
        <HeaderBack />
        <div className="page-wrapper padding-del">
            <div className="sales-section">
                <div className='sales-section__record-tit'>
                    <h2>하위자 수입 리스트 전체보기</h2>
                    <span>총 <small>00</small>건</span>
                </div>
                <ul className='sales-section__record-list refferal-record-list'>
                    <li>
                        <h3>하위자 판매 수입</h3>
                        <p>3,284,224</p>
                    </li>
                    <li>
                        <h3>하위자 판매 정산금</h3>
                        <p>1,864,392</p>
                    </li>
                    <li>
                        <h3>하위자 추천인</h3>
                        <p>4,203</p>
                    </li>
                    <li>
                        <h3>하위자 판매 노드 수</h3>
                        <p>4,384,938</p>
                    </li>
                </ul>
            </div>
            <div class="filter-group">
                <div class="filter-group__title">정렬</div>
                <div class="custom-select">
                    {/* custom-select에 is-open class 삽입 시 select option 노출 */}
                    <button type="button" class="custom-select__btn">
                        <span>최신순</span>
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
            <section className='table-section'>
                <div className="table-section-inner">

                    <div className="table-section__tit__list-head">
                    <div className="col">상태</div>
                    <div className="col">객단가</div>
                    <div className="col">개수</div>
                    <div className="col">총금액</div>
                    <div className="col">내 정산금</div>
                    <div className="col col--btn"></div>
                    </div>

                    {/*  하위 판매자가 없는 경우 */}
                    {!data || data.length === 0 ? (
                    <div className="table-empty">하위자의 판매 기록이 없습니다.</div>
                    ) : (
                    data.map((item, index) => (
                        <div key={item.id} className={`list-item ${openIndex === index ? 'open' : ''}`}>
                        <div className="list-item__row">
                            <div className="col">  
                                <span className={`
                                        status
                                        ${item.status === '승인대기' ? 'status--pending' : ''}
                                        ${item.status === '승인취소' ? 'status--cancelled' : ''}
                                        `}
                                    >
                                        {item.status}
                                    </span></div>
                            <div className="col">{item.객단가}</div>
                            <div className="col">{item.개수}</div>
                            <div className="col">{item.총금액}</div>
                            <div className="col">{item.내정산금}</div>
                            <div className="col col--btn toggle-btn-box">
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
                            <div className="info-table">
                                <div className="info-header">
                                <div className="col col--email">이메일 주소</div>
                                <div className="col">지분</div>
                                <div className="col">정산금</div>
                                <div className="col">정산상태</div>
                                </div>

                                {item.정산리스트.map((user, i) => (
                                <div className="info-row" key={i}>
                                    <div className="col col--email">
                                    {i === 0 ? (
                                        <strong>{user.email}</strong>
                                    ) : (
                                        <>
                                        <Link to="/OtherSalesRecord">
                                            <span>{user.email}</span>
                                            <img src={arrowRightIcon} alt="자세히 보기" className="arrow-icon" />
                                        </Link>
                                        </>
                                    )}
                                    </div>
                                    <div className="col">{user.지분}</div>
                                    <div className="col">{user.정산금}</div>
                                    <div className="col">{user.정산상태}</div>
                                </div>
                                ))}
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
    </>
  )
}

export default RefferalEarningList