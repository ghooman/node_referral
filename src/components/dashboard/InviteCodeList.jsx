import { Link } from "react-router-dom";
import React, { useState } from "react";

// img
import arrowDownIcon from "../../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../../assets/images/icon-arrow-up.svg";
import arrowRightIcon from "../../assets/images/icon-arrow-right.svg";

import "./InviteCodeList.scss";

function InviteCodeList({
  handleClickInviteBtn,
  inviteCodeList,
  formatDate,
  sliceList5,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="table-section">
      <div className="table-section-inner">
        <div className="table-section__tit">
          <div className="table-section__tit__tit-button">
            <h2>초대코드 리스트</h2>
            <button
              type="button"
              className="btn-sm"
              onClick={handleClickInviteBtn}
            >
              초대코드 생성
            </button>
          </div>
          <Link to="/RecommenderList">전체보기</Link>
        </div>

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
          sliceList5(inviteCodeList, 5).map((item, index) => (
            <div
              key={index}
              className={`list-item ${openIndex === index ? "open" : ""}`}
            >
              <div className="list-item__row">
                <div className="col">{item.share}</div>
                <div className="col">{item.invitation_code}</div>
                <div className="col mobile-del">{item.nick_name}</div>
                <div className="col mobile-del">{item.allocation_cnt}</div>
                <div className="col mobile-del">
                  {formatDate(item.create_dt)}
                </div>
                <div className="col col--action invite-code-button toggle-btn-box">
                  <button className="btn--line-mini">코드 복사</button>
                  <button className="btn--line-mini">초대링크 복사</button>
                  <button className="btn--line-mini">QR코드</button>
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
                      <Link to="/OtherSalesRecord">
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
  );
}

export default InviteCodeList;
