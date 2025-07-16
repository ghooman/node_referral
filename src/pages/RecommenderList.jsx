import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import arrowDownIcon from '../assets/images/icon-arrow-down.svg';
import arrowUpIcon from '../assets/images/icon-arrow-up.svg';
import arrowRightIcon from '../assets/images/icon-arrow-right.svg';

function RecommenderList() {
    const [openIndex, setOpenIndex] = useState(null);
  
      const toggle = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
      };
  
      const data = [
        {
          지분: '50%',
          코드: '7FBDWQ',
          닉네임: '닉네임은 최대열자입',
          인원: '3명',
          생성일: '2025.06.02 17:48',
          이메일리스트: ['kimcheomzi@mob.com', 'kimcheomji@mob.com', 'kimchumji@mob.com']
        },
      ];
  return (
    <>
    <div className="layout">
      <HeaderBack />
      <div className="page-wrapper padding-del">
          <div className="sales-section">
              <div className='sales-section__record-tit'>
                  <h2>추천인 리스트 전체보기</h2>
                  <span>총 <small>00</small>건</span>
              </div>
              <button type='button' className='sales-section__btn'>초대코드 생성</button>
          </div>
          <div class="filter-group">
              <div class="filter-group__title">정렬</div>
              <div class="custom-select">
                  {/* custom-select에 is-open class 삽입 시 select option 노출ㅋ */}
                  <button type="button" class="custom-select__btn">
                      <span>최신순</span>
                      <i class="custom-select__arrow"></i>
                  </button>
                  <ul class="custom-select__list">
                      <li class="is-selected">최신순</li>
                      <li>최신순</li>
                      <li>오래된순</li>
                      <li>지분 오름차순</li>
                      <li>지분 내림차순</li>
                      <li>할당인원 오름차순</li>
                      <li>할당인원 내림차순</li>
                  </ul>
              </div>
          </div>
          
          <section className='table-section'>
            <div className="table-section-inner">

            <div className="table-section__tit__list-head">
              <div className="col">지분</div>
              <div className="col">초대코드</div>
              <div className="col mobile-del">닉네임</div>
              <div className="col mobile-del">할당인원</div>
              <div className="col mobile-del">코드 생성일</div>
              <div className="col col--action">액션</div>
            </div>

            {/* 초대코드 리스트가 있는 경우 */}
            {data.map((item, index) => (
              <div key={index} className={`list-item ${openIndex === index ? 'open' : ''}`}>
                <div className='list-item__row'>
                  <div className="col">{item.지분}</div>
                  <div className="col">{item.코드}</div>
                  <div className="col mobile-del">{item.닉네임}</div>
                  <div className="col mobile-del">{item.인원}</div>
                  <div className="col mobile-del">{item.생성일}</div>
                  <div className="col col--action invite-code-button toggle-btn-box">
                    <button className="btn--line-mini">코드 복사</button>
                    <button className="btn--line-mini">초대링크 복사</button>
                    <button className="btn--line-mini">QR코드</button>
                    <button
                      className={`toggle-btn ${openIndex === index ? 'rotate' : ''}`}
                      onClick={() => toggle(index)}
                    >
                      <img src={arrowDownIcon} alt="토글" />
                    </button>
                  </div>
                </div>

                {openIndex === index && (
                  <div className="list-item__detail invite-code">
                    {item.이메일리스트.map((email, i) => (
                      <div key={i} className="email-row">
                        <Link to="/OtherSalesRecord">
                          <span className="index">{i + 1}</span>
                          <span className="email">{email}</span>
                        </Link>
                        <button className="arrow"><img src={arrowRightIcon} alt="더보기" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>


            {/* 초대코드 리스트가 없을 때 */}
            {/* <div className="table-empty">생성한 초대코드 리스트가 없습니다.</div> */}
          </section>
          <Pagination
              currentPage={1}
              totalPages={10}
              onPageChange={(page) => console.log('Go to page', page)}
              />
          
      </div>
      <Footer />
    </div>
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

export default RecommenderList