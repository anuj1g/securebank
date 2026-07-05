import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/customer/Home";
import SelectService from "./pages/customer/SelectService";
import YourDetails from "./pages/customer/YourDetails";
import TokenConfirmed from "./pages/customer/TokenConfirmed";
import LiveWaiting from "./pages/customer/LiveWaiting";
import YourTurn from "./pages/customer/YourTurn";

import Login from "./pages/staff/Login";
import Dashboard from "./pages/staff/Dashboard";
import History from "./pages/staff/History";


function RequireStaffAuth({ children }) {
  const token = localStorage.getItem("staffToken");
  return token ? children : <Navigate to="/staff/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Customer flow */}
      <Route path="/" element={<Home />} />
      <Route path="/select-service" element={<SelectService />} />
      <Route path="/your-details" element={<YourDetails />} />
      <Route path="/token-confirmed" element={<TokenConfirmed />} />
      <Route path="/live-waiting" element={<LiveWaiting />} />
      <Route path="/your-turn" element={<YourTurn />} />

      {/* Staff flow */}
      <Route path="/staff/login" element={<Login />} />
      <Route
        path="/staff/dashboard"
        element={
          <RequireStaffAuth>
            <Dashboard />
          </RequireStaffAuth>
        }
      />
      <Route
        path="/staff/history"
        element={
          <RequireStaffAuth>
            <History />
          </RequireStaffAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
