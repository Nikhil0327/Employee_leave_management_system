import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LeaveHistory from "./pages/LeaveHistory.jsx";
import LeaveApproval from "./pages/LeaveApproval.jsx";
import PolicySettings from "./pages/PolicySettings.jsx";
import Reports from "./pages/Reports.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./hooks/useAuth.jsx";

function RequireAuth({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >

        {/* EMPLOYEE */}

        <Route
          path="/employee"
          element={
            <RequireAuth roles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/employee/history"
          element={
            <RequireAuth roles={["EMPLOYEE"]}>
              <LeaveHistory />
            </RequireAuth>
          }
        />

        {/* MANAGER */}

        <Route
          path="/manager"
          element={
            <RequireAuth roles={["MANAGER"]}>
              <ManagerDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/manager/approvals"
          element={
            <RequireAuth roles={["MANAGER"]}>
              <LeaveApproval />
            </RequireAuth>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* THIS IS THE IMPORTANT NEW ROUTE */}

        <Route
          path="/admin/approvals"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <LeaveApproval />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/policy"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <PolicySettings />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <Reports />
            </RequireAuth>
          }
        />

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
