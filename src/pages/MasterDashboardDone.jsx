import axios from "axios";
import { Link } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
// compomnents
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import CopyButton from "../components/unit/CopyButton";
import MyDatePicker from "../components/unit/MyDatePicker";
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

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // 상단 대시보드 API 함수
  const handleGetDashboard = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/sales/settlement/dashboard`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("상단 대시보드 가져오기 완료!", res.data);
      setDashboard(res.data);
    } catch (error) {
      console.error("상단 대시보드 가져오는 API 함수 error입니당", error);
    }
  };

  // 하단 리스트 API 함수
  const handleGetDataList = async () => {
    const isoStart = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)).toISOString() : null;

    const isoEnd = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString() : null;

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

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper masterdashboard-wrapper">
          <ul className="tab-ui">
            <li>
              <Link to="/MasterDashboardDoing">판매승인/정산</Link>
            </li>
            <li className="selected">
              <Link to="/MasterDashboardDone">정산기록</Link>
            </li>
          </ul>

          {/* 날짜 필터링 */}
          <div className="filter-date">
            <label htmlFor="startDate">날짜 필터링</label>
            <div className="date-field">
              {/* 시작일 */}
              <MyDatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              <span className="dash">-</span>
              {/* 종료일 */}
              <MyDatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
              <button className="btn--reset" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>

          {/* 대시보드 */}
          <section className="dash-section">
            <h2 className="dash-section__tit">Dashboard</h2>
            <div className="dash-section__txt">
              <ul className="dash-section__txt__board">
                <li>
                  <h3>정산완료</h3>
                  <p>{dashboard.settlement_complt}</p>
                </li>
                <li>
                  <h3>전체 수입</h3>
                  <p>{dashboard.total_income}</p>
                </li>
                <li>
                  <h3>전체 정산금</h3>
                  <p>{dashboard.total_settlement}</p>
                </li>
                <li>
                  <h3>총 수수료 수입</h3>
                  <p>{dashboard.total_fee_income}</p>
                </li>
                <li>
                  <h3>총 전송 노드</h3>
                  <p>{dashboard.total_node}</p>
                </li>
              </ul>
            </div>
          </section>
          <div className="filter-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="이메일 및 지갑주소로 검색"
                className="search-bar__input"
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
                className="search-bar__btn"
                onClick={() => {
                  setCurrentPage(1);
                  handleGetDataList();
                }}
              >
                <img src={SearchIcon} alt="검색" aria-hidden="true" className="icon-search" />
                <span className="sr-only">검색</span>
              </button>
            </div>
          </div>
          <div className="table-section full-content-section">
            <div className="table-section-inner">
              {/* table head */}
              <div className="table-section__tit__list-head">
                <div className="col">구매자</div>
                <div className="col">판매자 이메일</div>
                <div className="col">지갑주소</div>
                <div className="col">개수</div>
                <div className="col">총금액</div>
                <div className="col">정산금</div>
                <div className="col">수수료</div>
                <div className="col">정산완료일시</div>
              </div>

              {/* table body */}
              {dataList.map((item, index) => (
                <div key={index} className="list-item">
                  <div className="list-item__row">
                    <div className="col">{item.buyer_name}</div>
                    <div className="col email">{item.username}</div>
                    <div className="col wallet-copy-com">
                      {item.wallet_address}
                      <CopyButton textToCopy={item.wallet_address} />
                    </div>
                    <div className="col">{item.cnt}</div>
                    <div className="col">{item.amount}</div>
                    <div className="col">{item.total_settlement_amount}</div>
                    <div className="col">{item.fee}</div>
                    <div className="col">{formatDate(item.settlement_dt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MasterDashboardDone;
