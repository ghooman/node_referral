import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import arrowDownIcon from "../../assets/images/icon-arrow-down.svg";
import CopyButton from "../unit/CopyButton";
import ConfirmModal from "../modal/ConfirmModal";

import "./SalesRecordList.scss";
import Loading from "../Loading";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function SalesRecordList({
  handleClickNewDealBtn,
  newDealList,
  setNewDealList,
  fetchNewDealList,
  formatDate,
  sliceList5,
  isPageLoading,
  formatNumber,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const [showConfirmModalIndex, setShowConfirmModalIndex] = useState(null);
  const userToken = localStorage.getItem("userToken");

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const getKoreanState = (state) => {
    const stateMap = {
      requested: "승인요청",
      pending: "승인대기",
      cancelled: "승인취소",
      approved: "승인완료",
      settlement_pending: "정산대기",
      settled: "정산완료",
    };
    return stateMap[state] || state;
  };

  const getBadgeClassName = (state) => {
    return state; // 상태명이 곧 className과 동일함
  };

  const handleChangeState = async (salesId, newState) => {
    try {
      const res = await axios.post(
        `${serverAPI}/api/sales/${salesId}/state`,
        null,
        {
          params: { state: newState },
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log("상태 변경 성공:", res.data.status);

      // 상태만 변경하는 경우
      const updatedList = newDealList.map((item) =>
        item.id === salesId ? { ...item, state: newState } : item
      );
      setNewDealList(updatedList);

      // 혹은 최신 상태 fetch
      await fetchNewDealList();

      setShowConfirmModalIndex(null);
    } catch (error) {
      console.error("상태 변경 실패:", error);
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
          <Link to="/sales-record">전체보기</Link>
        </div>

        <div className="table-section__tit__list-head sales-record">
          <div className="col">구매자</div>
          <div className="col mobile-del">개수</div>
          <div className="col mobile-del">객단가</div>
          <div className="col">총 금액</div>
          <div className="col">정산금</div>
          <div className="col mobile-del">등록일시</div>
          <div className="col">상태</div>
        </div>

        {newDealList.length === 0 ? (
          <div className="table-empty">판매 기록이 없습니다.</div>
        ) : (
          sliceList5(
            [...newDealList].sort(
              (a, b) => new Date(b.create_dt) - new Date(a.create_dt)
            ),
            5
          ).map((item, index) => (
            <div
              className={`list-item ${openIndex === index ? "open" : ""}`}
              key={index}
            >
              <div className="list-item__row sales-record">
                <div className="col">{item.buyer_name}</div>
                <div className="col mobile-del">{formatNumber(item.cnt)}</div>
                <div className="col mobile-del">
                  {formatNumber(item.unit_price)}
                </div>
                <div className="col">
                  {formatNumber(item.cnt * item.unit_price)}
                </div>
                <div className="col">
                  {formatNumber(item.settlement_amount)}
                </div>
                <div className="col mobile-del">
                  {formatDate(item.create_dt)}
                </div>
                <div className="col toggle-btn-box">
                  <button
                    className={`badge badge--${getBadgeClassName(item.state)}`}
                    onClick={() => {
                      console.log(
                        "🟡 버튼 클릭됨 - 현재 상태:",
                        item.state,
                        "id:",
                        item.id
                      );

                      if (item.state === "requested") {
                        console.log(
                          "🟢 승인요청 상태 → pending 으로 변경 시도"
                        );
                        // handleChangeState(item.id, "pending");
                        setShowConfirmModalIndex(item.id);
                      } else {
                        console.log(
                          "🔴 승인요청 상태가 아니라서 아무 작업도 하지 않음"
                        );
                      }
                    }}
                  >
                    {getKoreanState(item.state)}
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
                      <span>{item.memo ? item.memo : "-"}</span>
                    </p>
                  </div>
                  <div className="list-item__detail__list">
                    <p>
                      <b>승인완료 날짜</b>
                      <span>
                        {item.approval_dt ? formatDate(item.approval_dt) : "-"}
                      </span>
                    </p>
                    <p>
                      <b>정산완료 날짜</b>
                      <span>
                        {item.settlement_dt
                          ? formatDate(item.settlement_dt)
                          : "-"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showConfirmModalIndex !== null && (
        <ConfirmModal
          title="승인 요청"
          message={`요청 전송 시 노드 전송 및 정산을 진행합니다.\n노드 전송 및 정산금 입금은 영업일 기준 2~3일 소요됩니다.`}
          onClose={() => setShowConfirmModalIndex(null)}
          onConfirm={() => {
            handleChangeState(showConfirmModalIndex, "pending");
            setShowConfirmModalIndex(null);
          }}
        />
      )}
    </section>
  );
}

export default SalesRecordList;
