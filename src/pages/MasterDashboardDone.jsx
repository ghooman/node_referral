import axios from "axios";
import { Link } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import CopyButton from "../components/unit/CopyButton";
import MyDatePicker from "../components/unit/MyDatePicker";
import Loading from "../components/Loading";
// img
import SearchIcon from "../assets/images/icon-search.svg";
import arrowDownIcon from "../assets/images/icon-arrow-down.svg";
import arrowRightIcon from "../assets/images/icon-arrow-right.svg";
// style
import "../styles/pages/MasterDashboard.scss";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function MasterDashboardDone() {
  const userToken = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  const isMaster = userRole === "master";

  // 상단 대시보드 상태
  const [dashboard, setDashboard] = useState([]);
  // 하단 리스트 상태
  const [dataList, setDataList] = useState([]);
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // 검색창
  const [searchKeyword, setSearchKeyword] = useState("");
  // 날짜 초기값
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };
  const [openIndex, setOpenIndex] = useState(null);

  // 로딩
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // 상단 대시보드 API 함수
  const handleGetDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${serverAPI}/api/sales/settlement/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("상단 대시보드 가져오기 완료!", res.data);
      setDashboard(res.data);
    } catch (error) {
      console.error("상단 대시보드 가져오는 API 함수 error입니당", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 하단 리스트 API 함수
  const handleGetDataList = async () => {
    const isoStart = startDate
      ? new Date(new Date(startDate).setHours(0, 0, 0, 0)).toISOString()
      : null;

    const isoEnd = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString()
      : null;

    console.log("📤 서버로 보내는 start_date", isoStart);
    console.log("📤 서버로 보내는 end_date", isoEnd);

    try {
      const res = await axios.get(`${serverAPI}/api/sales/settlement/list`, {
        params: {
          page: currentPage,
          limit: 20,
          search_keyword: searchKeyword || undefined,
          ...(isoStart && { start_date: isoStart }),
          ...(isoEnd && { end_date: isoEnd }),
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const list = res.data.data_list;
      console.log("하단 리스트 가져와따아아아", list);
      setDataList(list);
      setTotalPages(Math.ceil(res.data.total_cnt / 20));
    } catch (error) {
      console.error("하단 리스트 가져오는 API 함수 error입니당", error);
    }
  };

  // 대시보드는 처음 한 번만 실행
  useEffect(() => {
    if (userToken) {
      handleGetDashboard();
    }
  }, [userToken]);

  // 하단 리스트는 값 바뀔때마다 실행
  useEffect(() => {
    if (userToken) {
      handleGetDataList();
    }
  }, [currentPage, searchKeyword, startDate, endDate]); // 변경될 때마다 호출

  // 날짜 포맷팅
  const formatDate = (isoString) => {
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

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper masterdashboard-wrapper">
          <ul className="tab-ui">
            <li>
              <Link to="/master-dashboard-doing">
                Sales Approval / Settlement
              </Link>
            </li>
            <li className="selected">
              <Link to="/master-dashboard-done">Settlement History</Link>
            </li>
          </ul>

          {/* 날짜 필터링 */}
          <div className="filter-date">
            <label htmlFor="startDate"> Date Filter</label>
            <div className="date-field">
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
              <button className="btn--reset" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          {/* 대시보드 */}
          <section className="dash-section">
            <h2 className="dash-section__tit">Dashboard</h2>
            <div className="dash-section__txt">
              <ul className="dash-section__txt__board">
                <li>
                  <h3>Settled</h3>
                  <p>{formatNumber(dashboard.settlement_complt)}</p>
                </li>
                <li>
                  <h3>Total Revenue</h3>
                  <p>{formatNumber(dashboard.total_income)}</p>
                </li>
                <li>
                  <h3>Total Settlement Amount</h3>
                  <p>{formatNumber(dashboard.total_settlement)}</p>
                </li>
                <li>
                  <h3>Total Fee Revenue</h3>
                  <p>{formatNumber(dashboard.total_fee_income)}</p>
                </li>
                <li>
                  <h3>Total Sent Nodes</h3>
                  <p>{formatNumber(dashboard.total_node)}</p>
                </li>
              </ul>
            </div>
          </section>
          <div className="filter-section">
            <div className="node-search-bar">
              <input
                type="text"
                placeholder="Search by Email or Wallet Address"
                className="node-search-bar__input"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1); // 페이지 초기화
                    handleGetDataList(); // 검색 즉시 실행
                  }
                }}
              />
              <button
                type="button"
                className="node-search-bar__btn"
                onClick={() => {
                  setCurrentPage(1);
                  handleGetDataList();
                }}
              >
                <img
                  src={SearchIcon}
                  alt="검색"
                  aria-hidden="true"
                  className="icon-search"
                />
                <span className="sr-only">검색</span>
              </button>
            </div>
          </div>
          <div className="table-section full-content-section">
            <div className="table-section-inner">
              {isLoading && (
                <div className="result-loading">
                  <Loading />
                </div>
              )}

              {!isLoading && (
                <>
                  {/* table head */}
                  <div className="table-section__tit__list-head">
                    <div className="col">Buyer</div>
                    <div className="col">Seller Email</div>
                    <div className="col">Wallet Address</div>
                    <div className="col">Quantity</div>
                    <div className="col">Total Amount</div>
                    <div className="col">Settlement Amount</div>
                    <div className="col">Fee</div>
                    <div className="col">Settlement Date & Time</div>
                  </div>

                  {/* table body */}
                  {dataList.map((item, index) => (
                    <div key={index} className="list-item">
                      <div className="list-item__row">
                        <div className="col">{item.buyer_name}</div>
                        <div className="col email">{item.username}</div>
                        <div className="col wallet-copy-com">
                          {formatWalletAddress(item.wallet_address)}
                          <CopyButton textToCopy={item.wallet_address} />
                        </div>
                        <div className="col">{formatNumber(item.cnt)}</div>
                        <div className="col">{formatNumber(item.amount)}</div>
                        <div className="col">
                          {formatNumber(item.total_settlement_amount)}
                        </div>
                        <div className="col">{formatNumber(item.fee)}</div>
                        <div className="col">
                          {formatDate(item.settlement_dt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MasterDashboardDone;
