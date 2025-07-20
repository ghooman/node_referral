import React, { useState } from "react";
import arrowUpIcon from "../../assets/images/icon-arrow-up.svg";
import arrowDownIcon from "../../assets/images/icon-arrow-down.svg";
import CopyButton from "../unit/CopyButton";

import "./SalesRecordList.scss";
import { Link } from "react-router-dom";

function SalesRecordList({
  handleClickNewDealBtn,
  newDealList,
  formatDate,
  sliceList5,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const getBadgeClassName = (state) => {
    switch (state) {
      case "승인요청":
        return "requested";
      case "승인대기":
        return "pending";
      case "승인취소":
        return "cancelled";
      case "승인완료":
        return "approved";
      case "정산대기":
        return "settlement_pending";
      case "정산완료":
        return "settled";
      default:
        return "";
    }
  };

  return (
    <section className="table-section">
      <div className="table-section-inner">
        <div className="table-section__tit">
          <div className="table-section__tit__tit-button">
            <h2>내 판매기록</h2>
            <button
              type="button"
              className="btn-sm"
              onClick={handleClickNewDealBtn}
            >
              새 거래 등록
            </button>
          </div>
          <Link to="/SalesRecord">전체보기</Link>
        </div>

        {/* list-head는 항상 보여줌 */}
        <div className="table-section__tit__list-head sales-record">
          <div className="col">구매자</div>
          <div className="col mobile-del">개수</div>
          <div className="col mobile-del">객단가</div>
          <div className="col">총 금액</div>
          <div className="col">정산금</div>
          <div className="col mobile-del">등록일시</div>
          <div className="col">상태</div>
        </div>

        {/* 데이터 유무에 따라 item or empty */}
        {!newDealList || newDealList.length === 0 ? (
          // 판매 기록이 없는 경우
          <div className="table-empty">판매 기록이 없습니다.</div>
        ) : (
          sliceList5(newDealList, 5).map((item, index) => (
            <div
              className={`list-item ${openIndex === index ? "open" : ""}`}
              key={index}
            >
              <div className="list-item__row sales-record">
                <div className="col">{item.buyer_name}</div>
                <div className="col mobile-del">{item.cnt}</div>
                <div className="col mobile-del">{item.unit_price}</div>
                <div className="col">{item.cnt * item.unit_price}</div>
                <div className="col">{item.settlement_amount}</div>
                <div className="col mobile-del">
                  {formatDate(item.create_dt)}
                </div>
                <div className="col toggle-btn-box">
                  <button
                    className={`badge badge--${getBadgeClassName(item.state)}`}
                  >
                    {item.state}
                  </button>
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

              {openIndex === index && (
                <div className="list-item__detail">
                  <div className="list-item__detail__list">
                    <p>
                      <b>지갑주소</b>
                      <span>
                        {item.buyer_wallet_address}
                        <CopyButton textToCopy={item.buyer_wallet_address} />
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
                      <span>{formatDate(item.approval_dt)}</span>
                    </p>
                    <p>
                      <b>정산완료 날짜</b>
                      <span>{item.settlement_dt}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default SalesRecordList;
