// src/components/routes/ProtectedRoutes.jsx
// 각 페이지에 역할 적용
// ex. master어쩌구는 master일 경우만 입장 가능하도록

import { Routes, Route } from "react-router-dom";
import RoleRoute from "./RoleRoute";
import Dashboard from "../../pages/Dashboard";
import SalesRecord from "../../pages/SalesRecord";
import RecommenderList from "../../pages/RecommenderList";
import ReferralEarningList from "../../pages/ReferralEarningList";
import OtherSalesRecord from "../../pages/OtherSalesRecord";
import MasterDashboardDoing from "../../pages/MasterDashboardDoing";
import MasterDashboardDone from "../../pages/MasterDashboardDone";

export default function ProtectedRoutes() {
  return (
    <Routes>
      {/* 유저 전용 */}
      <Route
        path="/affiliate/dashboard"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <Dashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/affiliate/sales-record"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <SalesRecord />
          </RoleRoute>
        }
      />
      <Route
        path="/affiliate/recommender-list"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <RecommenderList />
          </RoleRoute>
        }
      />
      <Route
        path="/affiliate/referral-earning-list"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <ReferralEarningList />
          </RoleRoute>
        }
      />
      <Route
        path="/affiliate/other-sales-record"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <OtherSalesRecord />
          </RoleRoute>
        }
      />

      {/* 마스터 전용 */}
      <Route
        path="/affiliate/master-dashboard-doing"
        element={
          <RoleRoute allowedRoles={["master"]}>
            <MasterDashboardDoing />
          </RoleRoute>
        }
      />
      <Route
        path="/affiliate/master-dashboard-done"
        element={
          <RoleRoute allowedRoles={["master"]}>
            <MasterDashboardDone />
          </RoleRoute>
        }
      />
    </Routes>
  );
}
