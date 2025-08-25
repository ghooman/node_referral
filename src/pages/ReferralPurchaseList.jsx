import { useState } from "react";
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";
import CopyButton from "../components/unit/CopyButton";

function ReferralPurchaseList() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openIndex, setOpenIndex] = useState(null);

  const statusMap = {
    all: "전체",
    pending: "승인대기",
    approved: "승인완료",
    settled: "정산완료",
  };

  const purchaseList = [
    {
      state: "pending",
      buyer: "4822...DBDT",
      unit_price: 1,
      cnt: 100,
      amount: 300,
      my_settlement_amount: 180.15,
      purchase_date: "2025.06.02 17:48",
      settlement_date: "-",
    },
    {
      state: "approved",
      buyer: "4822...DBDT",
      unit_price: 1,
      cnt: 100,
      amount: 300,
      my_settlement_amount: 180.15,
      purchase_date: "2025.06.02 17:48",
      settlement_date: "-",
    },
    {
      state: "settled",
      buyer: "4822...DBDT",
      unit_price: 1,
      cnt: 100,
      amount: 300,
      my_settlement_amount: 180.15,
      purchase_date: "2025.06.02 17:48",
      settlement_date: "2025.06.02 17:48",
    },
  ];

  const itemsPerPage = 20;
  const totalItems = purchaseList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //  상태 라벨
  const getStateLabel = (state) => {
    switch (state) {
      case "pending":
        return "승인대기";
      case "approved":
        return "승인완료";
      case "settled":
        return "정산완료";
      default:
        return "-";
    }
  };
  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper padding-del">
          <div className="sales-section">
            <div className="sales-section__record-tit">
              <h2>Sub-Affiliate Earnings List</h2>
              <span>
                Total <small>{purchaseList.length}</small>
              </span>
            </div>
            {/* 임시 요약 데이터 */}
            <ul className="sales-section__record-list referral-record-list">
              <li>
                {/* 레퍼럴 구매 수입 */}
                <h3>Referral Purchase Revenue</h3>
                <p>3,284,224</p>
              </li>
              <li>
                {/* 레퍼럴 구매 정산금 */}
                <h3>Referral Purchase Settlements</h3>
                <p>1,864,392</p>
              </li>
              <li>
                {/* 레퍼럴 구매 노드 수 */}
                <h3>Referral Purchase Nodes</h3>
                <p>4,203</p>
              </li>
              <li>
                {/* 내 레퍼럴 가입자 */}
                <h3>My Referral Members</h3>
                <p>400</p>
              </li>
            </ul>
          </div>

          {/* 필터 영역 */}
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button type="button" className="custom-select__btn" onClick={() => setIsFilterOpen((prev) => !prev)}>
                <span>{statusMap[selectedStatus]}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {Object.entries(statusMap).map(([key, label]) => (
                  <li
                    key={key}
                    className={selectedStatus === key ? "is-selected" : ""}
                    onClick={() => {
                      setSelectedStatus(key);
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

            <section className="table-section">
                <div className="table-section-inner">
                    {isPageLoading ? (
                    <div className="result-loading">
                        <Loading />
                    </div>
                    ) : (
                    <>
                    <div className="table-section__tit__list-head">
                        <div className="col">Status</div>
                        <div className="col">Buyer</div>
                        <div className="col">Unit Price</div>
                        <div className="col">Quantity</div>
                        <div className="col">Total Amount</div>
                        <div className="col">Settlement</div>
                        <div className="col">Purchase Date</div>
                        <div className="col">Settlement Date</div>
                    </div>

                        {purchaseList.map((item, index) => (
                        <div
                            key={index}
                            className={`list-item ${openIndex === index ? "open" : ""}`}
                        >
                            <div className="list-item__row">
                                <div className="col">
                                    <span className={`status status--${item.state}`}>
                                    {getStateLabel(item.state)}
                                    </span>
                            </div>
                          <div className="col wallet-copy-com">
                            {item.buyer}
                            <CopyButton textToCopy={item.buyer} />
                          </div>
                            <div className="col">{item.unit_price}</div>
                            <div className="col">{item.cnt}</div>
                            <div className="col">{item.amount}</div>
                            <div className="col">{item.my_settlement_amount}</div>
                            <div className="col">{item.purchase_date}</div>
                            <div className="col">{item.settlement_date}</div>

                            </div>
                        </div>
                        ))}
                    </>
                    )}
                </div>
            </section>

          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={(page) => setCurrentPage(page)} />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default ReferralPurchaseList