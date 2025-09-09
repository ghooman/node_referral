import React, { useEffect, useState } from "react";
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";
import CopyButton from "../components/unit/CopyButton";

import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function ReferralPurchaseList() {
  const userToken = localStorage.getItem("userToken");

  //----- 상태 ------------------------------------------------------------------------------------
  // 레퍼럴 구매목록 상태
  const [referralDashboard, setReferralDashboard] = useState({
    referral_buy_revenue: 0,
    referral_settlement: 0,
    referral_sold_nodes: 0,
    my_referrals: 0,
  });
  const [referralList, setReferralList] = useState([]);
  const [referralCnt, setReferralCnt] = useState(0);

  const [isPageLoading, setIsPageLoading] = useState(false);

  // 필터 정렬 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [openIndex, setOpenIndex] = useState(null);

  // 페이지네이션
  const itemsPerPage = 20; // 페이지 당 항목 수(기획에 맞춰 변경 가능)
  const totalPages = Math.ceil(referralCnt / itemsPerPage);
  const totalItems = referralCnt;

  //----- API 호출 함수  ------------------------------------------------------------------------------------
  // 레퍼럴 구매목록 대시보드 get api
  const GetReferralDashboard = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/referrals/buy/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setReferralDashboard(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // 레퍼럴 구매목록 대시보드 get api
  const GetReferralList = async () => {
    setIsPageLoading(true);
    try {
      const res = await axios.get(`${serverAPI}/api/sales/referrals/buy/list`, {
        params: {
          page: currentPage,
          limit: 20,
          state: selectedStatus === "all" ? undefined : selectedStatus,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setReferralList(res.data.data_list);
      setReferralCnt(res.data.total_cnt);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPageLoading(false);
    }
  };

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
  // 날짜 포맷팅
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const raw = new Date(isoString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    // "2025. 07. 19. 15:16" → "2025. 07. 19 15:16"
    return raw.replace(/(\d{2})\.\s(\d{2})\.\s(\d{2})\.\s/, "$1. $2. $3 ");
  };

  // 지갑 주소 포맷팅 함수 (앞뒤 4글자씩 짜르기 0x00....0000)
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (isNaN(num)) return 0;
    return Number(num).toLocaleString("en-US"); // "1,000", "50,000" 형태
  };

  //----- 필터 제어 ------------------------------------------------------------------------------------
  // 필터 드롭다운 순서
  const STATUS_OPTIONS = [
    { key: "all", label: "All" },
    { key: "approved", label: "Approved" },
    // { key: "승인완료", label: "Settlement" },
    { key: "settled", label: "Paid" },
  ];

  // 필터 라벨링
  const statusLabelMap = React.useMemo(() => Object.fromEntries(STATUS_OPTIONS.map((o) => [o.key, o.label])), []);
  const getStateLabel = (state) => statusLabelMap[state] || state;

  //----- useEffect 모음  ------------------------------------------------------------------------------------
  // 로그인 후 첫 진입 시, 상단 대시보드 불러오기
  useEffect(() => {
    GetReferralDashboard();
  }, []);

  // 하단 리스트 불러오기
  useEffect(() => {
    GetReferralList();
  }, [currentPage, selectedStatus]);

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper">
          <div className="sales-section">
            <div className="sales-section__record-tit">
              <h2>My Direct Clients Sales Board</h2>
              <span>
                Total <small>{referralCnt}</small>
              </span>
            </div>
            {/* 임시 요약 데이터 */}
            <ul className="sales-section__record-list referral-record-list">
              <li>
                {/* 레퍼럴 구매 수입 */}
                <h3>Sales Volume by Direct Client</h3>
                <p>{formatNumber(referralDashboard.referral_buy_revenue)}</p>
              </li>
              <li>
                {/* 레퍼럴 구매 정산금 */}
                <h3>Direct Client’s Commission</h3>
                <p>{formatNumber(referralDashboard.referral_settlement)}</p>
              </li>
              <li>
                {/* 레퍼럴 구매 노드 수 */}
                <h3>Number of Nodes Direct Client Sold</h3>
                <p>{formatNumber(referralDashboard.referral_sold_nodes)}</p>
              </li>
              <li>
                {/* 내 레퍼럴 가입자 */}
                <h3>My Direct Clients</h3>
                <p>{formatNumber(referralDashboard.my_referrals)}</p>
              </li>
            </ul>
          </div>

          {/* 필터 영역 */}
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button type="button" className="custom-select__btn" onClick={() => setIsFilterOpen((prev) => !prev)}>
                <span>{getStateLabel(selectedStatus)}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {STATUS_OPTIONS.map((opt) => (
                  <li
                    key={opt.key}
                    className={selectedStatus === opt.key ? "is-selected" : ""}
                    onClick={() => {
                      setSelectedStatus(opt.key);
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
                  >
                    {opt.label}
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
              ) : referralCnt === 0 ? (
                <div className="table-empty">No purchase records found.</div>
              ) : (
                <>
                  {/* table head */}
                  <div className="table-section__tit__list-head">
                    <div className="col">Status</div>
                    <div className="col">Client</div>
                    <div className="col">Unit Price</div>
                    <div className="col">Quantity</div>
                    <div className="col">Sales Volume</div>
                    <div className="col">My Commission</div>
                    <div className="col">Purchase Date</div>
                    <div className="col">Paid Date</div>
                  </div>

                  {/* table body */}
                  {referralList.map((item, index) => (
                    <div key={index} className={`list-item ${openIndex === index ? "open" : ""}`}>
                      <div className="list-item__row">
                        <div className="col">
                          <span className={`status status--${item.state}`}>{getStateLabel(item.state)}</span>
                        </div>
                        <div className="col wallet-copy-com">
                          {formatWalletAddress(item.buyer_wallet_address)}
                          <CopyButton textToCopy={item.buyer_wallet_address} />
                        </div>
                        <div className="col">{item.unit_price}</div>
                        <div className="col">{item.cnt}</div>
                        <div className="col">{item.amount}</div>
                        <div className="col">{item.settlement_amount}</div>
                        <div className="col">{formatDate(item.create_dt)}</div>
                        <div className="col">{formatDate(item.settlement_dt)}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ReferralPurchaseList;
