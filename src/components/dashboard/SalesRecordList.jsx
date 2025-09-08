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
      all: "All",
      requested: "Requested",
      pending: "Pending",
      approved: "Approved",
      cancelled: "Cancelled",
      // 승인완료: "Settlement",
      settled: "Settled",
    };
    return stateMap[state] || state;
  };

  const getBadgeClassName = (state) => {
    return state; // 상태명이 곧 className과 동일함
  };

  const handleChangeState = async (salesId, newState) => {
    try {
      const res = await axios.post(`${serverAPI}/api/sales/${salesId}/state`, null, {
        params: { state: newState },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log("상태 변경 성공:", res.data.status);

      // 상태만 변경하는 경우
      const updatedList = newDealList.map((item) => (item.id === salesId ? { ...item, state: newState } : item));
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
        {isPageLoading ? (
          <div className="result-loading">
            <Loading />
          </div>
        ) : (
          <>
            <div className="table-section__tit">
              <div className="table-section__tit__tit-button">
                <h2>My Sales Records</h2>
                <button type="button" className="btn-sm" onClick={handleClickNewDealBtn}>
                  New Transaction
                </button>
              </div>
              <Link to="/sales-record">View All</Link>
            </div>

            <div className="table-section__tit__list-head sales-record">
              <div className="col">Buyer</div>
              <div className="col mobile-del">Quantity</div>
              <div className="col mobile-del">Unit Price</div>
              <div className="col">Total Amount</div>
              <div className="col">Settlement Amount</div>
              <div className="col mobile-del">Registration Date</div>
              <div className="col">Status</div>
            </div>

            {newDealList.length === 0 ? (
              <div className="table-empty">No sales records.</div>
            ) : (
              sliceList5(
                [...newDealList].sort((a, b) => new Date(b.create_dt) - new Date(a.create_dt)),
                5
              ).map((item, index) => (
                <div className={`list-item ${openIndex === index ? "open" : ""}`} key={index}>
                  <div className="list-item__row sales-record">
                    <div className="col">{item.buyer_name}</div>
                    <div className="col mobile-del">{formatNumber(item.cnt)}</div>
                    <div className="col mobile-del">{formatNumber(item.unit_price)}</div>
                    <div className="col">{formatNumber(item.cnt * item.unit_price)}</div>
                    <div className="col">{formatNumber(item.settlement_amount)}</div>
                    <div className="col mobile-del">{formatDate(item.create_dt)}</div>
                    <div className="col toggle-btn-box">
                      <button
                        className={`badge badge--${getBadgeClassName(item.state)}`}
                        onClick={() => {
                          console.log("🟡 버튼 클릭됨 - 현재 상태:", item.state, "id:", item.id);

                          if (item.state === "requested") {
                            console.log("🟢 승인요청 상태 → pending 으로 변경 시도");
                            // handleChangeState(item.id, "pending");
                            setShowConfirmModalIndex(item.id);
                          } else {
                            console.log("🔴 승인요청 상태가 아니라서 아무 작업도 하지 않음");
                          }
                        }}
                      >
                        {getKoreanState(item.state)}
                      </button>

                      <button
                        className={`toggle-btn ${openIndex === index ? "rotate" : ""}`}
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
                          <b>Wallet Address</b>
                          <span>
                            {item.buyer_wallet_address}
                            <CopyButton textToCopy={item.buyer_wallet_address} />
                          </span>
                        </p>
                        <p>
                          <b>Note</b>
                          <span>{item.memo ? item.memo : "-"}</span>
                        </p>
                      </div>
                      <div className="list-item__detail__list">
                        <p>
                          <b>Approval Completed Date</b>
                          <span>{item.approval_dt ? formatDate(item.approval_dt) : "-"}</span>
                        </p>
                        <p>
                          <b>Settlement Completed Date</b>
                          <span>{item.settlement_dt ? formatDate(item.settlement_dt) : "-"}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {showConfirmModalIndex !== null && (
        <ConfirmModal
          title="Request Approval"
          message={`Upon submission, the node transfer and settlement process will begin.\nNode transfer and settlement deposits will take 2–3 business days.`}
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
