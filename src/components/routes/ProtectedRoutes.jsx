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
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sales-record" element={<SalesRecord />} />
      <Route path="/recommender-list" element={<RecommenderList />} />
      <Route path="/referral-earning-list" element={<ReferralEarningList />} />
      <Route path="/other-sales-record" element={<OtherSalesRecord />} />
      <Route
        path="/master-dashboard-doing"
        element={<MasterDashboardDoing />}
      />
      <Route path="/master-dashboard-done" element={<MasterDashboardDone />} />
    </Routes>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoutes;
