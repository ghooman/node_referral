import { useState } from "react";
import Header from "../components/unit/Header";
import Footer from "../components/unit/Footer";
import Pagination from "../components/unit/Pagination";
import Loading from "../components/Loading";
import CopyButton from "../components/unit/CopyButton";

function ReferralRegistrantsList() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("latest");
  const [selectedSortOption, setSelectedSortOption] = useState("latest");

  const registrants = [
    // 지갑주소 전체 노출
    { username: "4822dssdajkndjkasnjaks3432432432454DBDT", joinedDate: "2025. 06. 02 17:48" },
    { username: "4822dssdajkndjkasnjaks3432432432454DBDT", joinedDate: "2025. 06. 02 17:48" },
    { username: "4822dssdajkndjkasnjaks3432432432454DBDT", joinedDate: "2025. 06. 02 17:48" },
    { username: "4822dssdajkndjkasnjaks3432432432454DBDT", joinedDate: "2025. 06. 02 17:48" },
  ];

  const itemsPerPage = 20;
  const totalItems = registrants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const sortOptions = [
    { label: "Latest", value: "latest" }, // 가입일시 오름차순
    { label: "Oldest", value: "oldest" }, // 가입일시 내림차순
  ];
  const handleSelectFilter = (label, value) => {
    setSelectedSortOption(value);
    setIsFilterOpen(false);
  };

  return (
    <>
    <div className="layout">
      <Header />
      <div className="page-wrapper table-center">
        <div className="sales-section">
          <div className="sales-section__record-tit">
            <h2>Referral Registrants List</h2>
            <span>
              Total <small>{registrants.length}</small>
            </span>
          </div>
        </div>
        {/* 필터 정렬 */}
        <div className="filter-group">
          <div className="filter-group__title">Filter</div>
          <div
            className={`custom-select ${isFilterOpen ? "is-open" : ""}`}
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <button type="button" className="custom-select__btn">
              <span>{selectedFilter}</span>
              <i className="custom-select__arrow"></i>
            </button>
            <ul className="custom-select__list">
              {sortOptions.map((item, index) => (
              <li
                key={index}
                className={selectedSortOption === item.value ? "is-selected" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectFilter(item.label, item.value);
                }}
              >
                {item.label}
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
            ) : registrants.length === 0 ? (
              <div className="table-empty">No registrants found.</div>
            ) : (
              <>
                <div className="table-section__tit__list-head">
                  <div className="col">Registrants</div>
                  <div className="col">Join Date</div>
                </div>

                {registrants.map((item, index) => (
                  <div key={index} className="list-item">
                    <div className="list-item__row">
                      <div className="col wallet-copy-com">
                        {item.username}
                        <CopyButton textToCopy={item.username} />
                      </div>
                      <div className="col">{item.joinedDate}</div>
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
  )
}

export default ReferralRegistrantsList