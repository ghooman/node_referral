import React from "react";
import arrowDownIcon from "../../assets/images/icon-arrow-down.svg";
import arrowUpIcon from "../../assets/images/icon-arrow-up.svg";
import arrowRightIcon from "../../assets/images/icon-arrow-right.svg";
import OtherSalesRecord from "../../pages/OtherSalesRecord";
import { Link } from "react-router-dom";
import "./ReferralEarnings.scss";

function ReferralEarnings({ openIndex, handleToggle, downReferralActive, sliceList5 }) {
  const dummyDataList = [
    {
      state: "requested", // ← 문자열
      unit_price: 100,
      cnt: 10,
      my_settlement_amount: 30,
      amount: 20,
      referrals: [
        {
          id: 0,
          username: "ref1@metapol.io",
          share: 30,
          settlement_amount: 300,
          is_complt: true, // ← 불리언
          settlement_dt: "2025-07-23T07:20:00.000Z",
        },
        {
          id: 1,
          username: "ref2@metapol.io",
          share: 20,
          settlement_amount: 200,
          is_complt: false, // ← 불리언
          settlement_dt: "2025-07-23T07:25:00.000Z",
        },
      ],
    },
    {
      state: "cancelled", // ← 문자열
      unit_price: 100,
      cnt: 10,
      my_settlement_amount: 30,
      amount: 20,
      referrals: [
        {
          id: 0,
          username: "ref3@metapol.io",
          share: 50,
          settlement_amount: 1500,
          is_complt: true,
          settlement_dt: "2025-07-22T18:30:00.000Z",
        },
      ],
    },
  ];

  const toggle = (index) => {
    handleToggle((prev) => (prev === index ? null : index));
  };

  const mapReferralListWithStatus = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      const isComplete = String(item.is_complt).toLowerCase() === "true";
      return {
        ...item,
        settleStatusType: isComplete ? "success" : "failed",
      };
    });
  };

  const dummyData = mapReferralListWithStatus(dummyDataList);
  // 실제 데이터 기반 처리
  const realData = mapReferralListWithStatus(downReferralActive);
  const safeRealData = Array.isArray(realData) ? realData : [];
  const slicedData = sliceList5(safeRealData, 5);

  const getStateLabel = (state) => {
    const map = {
      requested: "승인요청",
      pending: "승인대기",
      cancelled: "승인취소",
      approved: "승인완료",
      settlement_pending: "정산대기",
      settled: "정산완료",
    };
    return map[state] || state;
  };

  return (
    <section className="table-section">
      <div className="table-section-inner">
        <div className="table-section__tit">
          <h2>하위자 수입 리스트</h2>
          <Link to="/ReferralEarningList">전체보기</Link>
        </div>

        <div className="table-section__tit__list-head">
          <div className="col">상태</div>
          <div className="col">객단가</div>
          <div className="col">개수</div>
          <div className="col">총금액</div>
          <div className="col">내 정산금</div>
          <div className="col col--btn"></div>
        </div>

        {/*  하위 판매자가 없는 경우 */}
        {slicedData.length === 0 ? (
          <div className="table-empty">하위자의 판매 기록이 없습니다.</div>
        ) : (
          slicedData.map((item, index) => (
            <div key={index} className={`list-item ${openIndex === index ? "open" : ""}`}>
              <div className="list-item__row">
                <div className="col">
                  <span className={`status status--${item.state}`}>{getStateLabel(item.state)}</span>
                </div>
                <div className="col">{item.unit_price}</div>
                <div className="col">{item.cnt}</div>
                <div className="col">{item.amount}</div>
                <div className="col">{item.my_settlement_amount}</div>
                <div className="col col--btn toggle-btn-box" style={{ width: "15px", height: "20px" }}>
                  <button className={`toggle-btn ${openIndex === index ? "rotate" : ""}`} onClick={() => toggle(index)}>
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

                    {item.referrals.map((user, i) => (
                      <div className="info-row" key={i}>
                        <div className="col col--email">
                          {i === 0 ? (
                            <strong>{user.username}</strong>
                          ) : (
                            <>
                              <Link to={`/OtherSalesRecord?email=${user.username}`}>
                                <span>{user.username}</span>
                                <img src={arrowRightIcon} alt="자세히 보기" className="arrow-icon" />
                              </Link>
                            </>
                          )}
                        </div>
                        <div className="col">{user.share}%</div>
                        <div className="col">{user.settlement_amount}</div>
                        <div className="col">
                          <span className={`status ${user.is_complt ? "status--success" : "status--failed"}`}>
                            {user.is_complt ? "완료" : "대기"}
                          </span>
                        </div>
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
  );
}

export default ReferralEarnings;
