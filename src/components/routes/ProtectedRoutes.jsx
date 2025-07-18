import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import SalesRecord from "../../pages/SalesRecord";
import RecommenderList from "../../pages/RecommenderList";
import RefferalEarningList from "../../pages/RefferalEarningList";
import OtherSalesRecord from "../../pages/OtherSalesRecord";
import MasterDashboardDoing from "../../pages/MasterDashboardDoing";
import MasterDashboardDone from "../../pages/MasterDashboardDone";

const isAuthenticated = () => {
  return !!localStorage.getItem("userToken"); // ✅ 로그인 여부 확인
};

const ProtectedRoutes = () => {
  return isAuthenticated() ? (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/SalesRecord" element={<SalesRecord />} />
      <Route path="/RecommenderList" element={<RecommenderList />} />
      <Route path="/RefferalEarningList" element={<RefferalEarningList />} />
      <Route path="/OtherSalesRecord" element={<OtherSalesRecord />} />
      <Route path="/MasterDashboardDoing" element={<MasterDashboardDoing />} />
      <Route path="/MasterDashboardDone" element={<MasterDashboardDone />} />
    </Routes>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;
