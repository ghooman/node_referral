import React, { useState, useEffect } from "react";
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Loading from "../components/Loading";
import CopyButton from "../components/unit/CopyButton";

import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

function ReferralRegistrantsList() {
  const userToken = localStorage.getItem("userToken");

  //----- 상태 ------------------------------------------------------------------------------------
  // 레퍼럴 가입자 상태
  const [referralList, setReferralList] = useState([]);
  const [referralCnt, setReferralCnt] = useState(0);

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("desc");

  //----- API 호출 함수  ------------------------------------------------------------------------------------
  // 레퍼럴 가입자 get api
  const GetReferralList = async () => {
    setIsPageLoading(true);
    try {
      const res = await axios.get(`${serverAPI}/api/user/referrals?sort_by=${selectedSortOption}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const list = res.data || [];
      setReferralList(list);
      setReferralCnt(list.length);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPageLoading(false);
    }
  };

  //----- 함수 로직 모음  ------------------------------------------------------------------------------------
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

  //----- 필터 제어 ------------------------------------------------------------------------------------
  // 필터 드롭다운 순서
  const SORT_OPTIONS = [
    { value: "desc", label: "Latest" }, // 최신순(내림차순)
    { value: "asc", label: "Oldest" }, // 오래된순(오름차순)
  ];

  //----- useEffect 모음  ------------------------------------------------------------------------------------
  useEffect(() => {
    GetReferralList();
  }, [selectedSortOption]);

  return (
    <>
      <div className="layout">
        <Header />
        <div className="page-wrapper table-center">
          <div className="sales-section">
            <div className="sales-section__record-tit">
              <h2>Referral Registrants List</h2>
              <span>
                Total <small>{referralCnt}</small>
              </span>
            </div>
          </div>
          {/* 필터 정렬 */}
          <div className="filter-group">
            <div className="filter-group__title">Filter</div>
            <div className={`custom-select ${isFilterOpen ? "is-open" : ""}`}>
              <button type="button" className="custom-select__btn" onClick={() => setIsFilterOpen((prev) => !prev)}>
                <span>{SORT_OPTIONS.find((o) => o.value === selectedSortOption)?.label}</span>
                <i className="custom-select__arrow"></i>
              </button>
              <ul className="custom-select__list">
                {SORT_OPTIONS.map((opt) => (
                  <li
                    key={opt.value}
                    className={selectedSortOption === opt.value ? "is-selected" : ""}
                    onClick={() => {
                      setSelectedSortOption(opt.value);
                      setIsFilterOpen(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* 테이블 섹션 */}
          <section className="table-section">
            <div className="table-section-inner">
              {isPageLoading ? (
                <div className="result-loading">
                  <Loading />
                </div>
              ) : referralCnt === 0 ? (
                <div className="table-empty">No registrants found.</div>
              ) : (
                <>
                  <div className="table-section__tit__list-head">
                    <div className="col">Registrants</div>
                    <div className="col">Join Date</div>
                  </div>

                  {referralList.map((item, index) => (
                    <div key={index} className="list-item">
                      <div className="list-item__row">
                        <div className="col wallet-copy-com flex-left">
                          {item.wallet_address}
                          <CopyButton textToCopy={item.wallet_address} />
                        </div>
                        <div className="col">{formatDate(item.create_dt)}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ReferralRegistrantsList;
