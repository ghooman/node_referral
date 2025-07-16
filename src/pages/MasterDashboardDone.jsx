import { Link } from 'react-router-dom';
import React, { useState } from 'react';
// compomnents
import Header from '../components/unit/Header';
import Footer from '../components/unit/Footer';
import Pagination from '../components/unit/Pagination';
import CopyButton from '../components/unit/CopyButton';
import MyDatePicker from '../components/unit/MyDatePicker';
// img
import SearchIcon from '../assets/images/icon-search.svg';
import arrowDownIcon from '../assets/images/icon-arrow-down.svg';
import arrowRightIcon from '../assets/images/icon-arrow-right.svg';
// style
import '../styles/pages/MasterDashboard.scss';

function MasterDashboardDone() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleReset = () => {
      setStartDate('');
      setEndDate('');
    };
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
    };
    const data = [
    {
      buyer: '김첨지',
      email: 'kimchumzi@mob.com',
      wallet: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      quantity: 3,
      totalAmount: 300,
      settlementAmount: 280,
      fee: 20,
      settlementDate: '2025.06.02 17:48',
    },
    {
      buyer: '김첨지',
      email: 'kimchumzi@mob.com',
      wallet: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      quantity: 3,
      totalAmount: 300,
      settlementAmount: 280,
      fee: 20,
      settlementDate: '2025.06.02 17:48',
    },
    ];

  return (
    <>
    <div className="layout">
      <Header />
      <div className="page-wrapper masterdashboard-wrapper">
          <ul className='tab-ui'>
              <li>
                  <Link to="/MasterDashboardDoing">
                      판매승인/정산
                  </Link>
              </li>
              <li className='selected'>
                  <Link to="/MasterDashboardDone">
                      정산기록
                  </Link>
              </li>
          </ul>

          {/* 날짜 필터링 */}
          <div className="filter-date">
            <label htmlFor="startDate">날짜 필터링</label>
            <div className='date-field'>
              {/* 시작일 */}
              <MyDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <span className="dash">-</span>
              {/* 종료일 */}
              <MyDatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
              <button className="btn--reset" onClick={handleReset}>초기화</button>

            </div>
          </div>

          
          {/* 대시보드 */}
          <section className='dash-section'>
              <h2 className='dash-section__tit'>Dashboard</h2>
              <div className='dash-section__txt'>
                  <ul className='dash-section__txt__board'>
                      <li>
                          <h3>정산완료</h3>
                          <p>300</p>
                      </li>
                      <li>
                          <h3>전체 수입</h3>
                          <p>282</p>
                      </li>
                      <li>
                          <h3>전체 정산금</h3>
                          <p>10</p>
                      </li>
                      <li>
                          <h3>총 수수료 수입</h3>
                          <p>5</p>
                      </li>
                      <li>
                          <h3>총 전송 노드</h3>
                          <p>3</p>
                      </li>
                  </ul>
              </div>
          </section>
          <div className='filter-section'>
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
          <div className="table-section full-content-section">
              <div className='table-section-inner'>
                  {/* table head */}
                  <div className="table-section__tit__list-head">
                      <div className="col">구매자</div>
                      <div className="col">판매자 이메일</div>
                      <div className="col">지갑주소</div>
                      <div className="col">개수</div>
                      <div className="col">총금액</div>
                      <div className="col">정산금</div>
                      <div className="col">수수료</div>
                      <div className="col">정산완료일시</div>
                  </div>

                  {/* table body */}
                  {data.map((item, index) => (
                    <div key={index} className="list-item">
                      <div className="list-item__row">
                        <div className="col">{item.buyer}</div>
                        <div className="col email">{item.email}</div>
                        <div className="col wallet-copy-com">
                          {item.wallet}
                          <CopyButton textToCopy={item.wallet} />
                        </div>
                        <div className="col">{item.quantity}</div>
                        <div className="col">{item.totalAmount}</div>
                        <div className="col">{item.settlementAmount}</div>
                        <div className="col">{item.fee}</div>
                        <div className="col">{item.settlementDate}</div>
                      </div>
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
    </div>
    </>
  )
}

export default MasterDashboardDone