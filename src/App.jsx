import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute  from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import NetworkStatus   from "./components/NetworkStatus";

import Login       from "./Pages/auth/Login";
import NotFound    from "./Pages/dashboard/Notfound";
import Dashboard   from "./Pages/dashboard/dashboard";
import Production  from "./Pages/dashboard/production";
import Inventory   from "./Pages/dashboard/inventory";
import Category    from "./Pages/dashboard/category";
import Formulation from "./Pages/dashboard/formulation";
import Sales       from "./Pages/dashboard/sales";
import Orders      from "./Pages/dashboard/orders";
import Customers   from "./Pages/dashboard/customers";
import Staff       from "./Pages/dashboard/staff";
import Settings    from "./Pages/dashboard/settings";

export default function App() {
  return (
    <BrowserRouter>
      <NetworkStatus />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/production"  element={<Production />} />
          <Route path="/inventory"   element={<Inventory />} />
          <Route path="/category"    element={<Category />} />
          <Route path="/formulation" element={<Formulation />} />
          <Route path="/sales"       element={<Sales />} />
          <Route path="/orders"      element={<Orders />} />
          <Route path="/customers"   element={<Customers />} />
          <Route path="/staff"       element={<Staff />} />
          <Route path="/settings"    element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}