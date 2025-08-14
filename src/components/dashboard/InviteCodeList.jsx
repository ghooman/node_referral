import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Loading from "../Loading";

// img
import arrowDownIcon from "../../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../../assets/images/icon-arrow-up.svg";
import arrowRightIcon from "../../assets/images/icon-arrow-right.svg";

import "./InviteCodeList.scss";

function InviteCodeList({ handleClickInviteBtn, inviteCodeList, formatDate, sliceList5, isPageLoading, formatNumber }) {
  const [openIndex, setOpenIndex] = useState(null);

  const [copiedIndex, setCopiedIndex] = useState({ code: null, link: null });

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex((prev) => ({ ...prev, code: index }));
  };

  const handleCopyLink = (code, index) => {
    // url 확정되면 변경 필요
    const fullUrl = `https://affiliate.musicontheblock.com/signup/?r=${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex((prev) => ({ ...prev, link: index }));
  };

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (copiedIndex.code !== null || copiedIndex.link !== null) {
      const timer = setTimeout(() => {
        setCopiedIndex({ code: null, link: null });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  return (
    <section className="table-section">
      <div className="table-section-inner">
        {isPageLoading ? (
          <div className="result-loading">
            <Loading />
          </div>
        ) : (
          <>
            <div className="table-section__tit">
              <div className="table-section__tit__tit-button">
                <h2>Invite Code List</h2>
                <button type="button" className="btn-sm" onClick={handleClickInviteBtn}>
                  Create Invite Code
                </button>
              </div>
              <Link to="/recommender-list">View All</Link>
            </div>

            <div className="table-section__tit__list-head">
              <div className="col">Share</div>
              <div className="col">Invite Code</div>
              <div className="col mobile-del">Nickname</div>
              <div className="col mobile-del">Allocated Users</div>
              <div className="col mobile-del">Created Date</div>
              <div className="col col--action">Actions</div>
            </div>

            {/* 초대코드 리스트가 있는 경우 */}
            {inviteCodeList.length > 0 ? (
              sliceList5(inviteCodeList, 5).map((item, index) => (
                <div key={index} className={`list-item ${openIndex === index ? "open" : ""}`}>
                  <div className="list-item__row">
                    <div className="col">{item.share}%</div>
                    <div className="col">{item.invitation_code}</div>
                    <div className="col mobile-del">{item.nick_name}</div>
                    <div className="col mobile-del">{formatNumber(item.allocation_cnt)}</div>
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
  );
}

export default InviteCodeList;
