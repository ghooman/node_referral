import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import SalesRecord from "../../pages/SalesRecord";
import RecommenderList from "../../pages/RecommenderList";
import ReferralEarningList from "../../pages/ReferralEarningList";
import OtherSalesRecord from "../../pages/OtherSalesRecord";
import MasterDashboardDoing from "../../pages/MasterDashboardDoing";
import MasterDashboardDone from "../../pages/MasterDashboardDone";

const isAuthenticated = () => {
  return !!localStorage.getItem("userToken"); // ✅ 로그인 여부 확인
};

const ProtectedRoutes = () => {
  return isAuthenticated() ? (
    <Routes>
      <Route path="/affiliate/dashboard" element={<Dashboard />} />
      <Route path="/affiliate/sales-record" element={<SalesRecord />} />
      <Route path="/affiliate/recommender-list" element={<RecommenderList />} />
      <Route path="/affiliate/referral-earning-list" element={<ReferralEarningList />} />
      <Route path="/affiliate/other-sales-record" element={<OtherSalesRecord />} />
      <Route path="/affiliate/master-dashboard-doing" element={<MasterDashboardDoing />} />
      <Route path="/affiliate/master-dashboard-done" element={<MasterDashboardDone />} />
    </Routes>
  ) : (
    <Navigate to="/affiliate/login" replace />
  );
};

export default ProtectedRoutes;
