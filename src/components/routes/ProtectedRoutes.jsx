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
import ReferralPurchaseList from "../../pages/ReferralPurchaseList";
import ReferralRegistrantsList from "../../pages/ReferralRegistrantsList";

export default function ProtectedRoutes() {
  return (
    <Routes>
      {/* 유저 전용 */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <Dashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/sales-record"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <SalesRecord />
          </RoleRoute>
        }
      />
      <Route
        path="/recommender-list"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <RecommenderList />
          </RoleRoute>
        }
      />
      <Route
        path="/referral-earning-list"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <ReferralEarningList />
          </RoleRoute>
        }
      />
      <Route
        path="/other-sales-record"
        element={
          <RoleRoute allowedRoles={["user", "master"]}>
            <OtherSalesRecord />
          </RoleRoute>
        }
      />
      {/* 추가 페이지 */}
      <Route
        path="/referral-purchase-list"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <ReferralPurchaseList />
          </RoleRoute>
        }
      />
      <Route
        path="/referral-registrants-list"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <ReferralRegistrantsList />
          </RoleRoute>
        }
      />

      {/* 마스터 전용 */}
      <Route
        path="/master-dashboard-doing"
        element={
          <RoleRoute allowedRoles={["master"]}>
            <MasterDashboardDoing />
          </RoleRoute>
        }
      />
      <Route
        path="/master-dashboard-done"
        element={
          <RoleRoute allowedRoles={["master"]}>
            <MasterDashboardDone />
          </RoleRoute>
        }
      />
    </Routes>
  );
}
