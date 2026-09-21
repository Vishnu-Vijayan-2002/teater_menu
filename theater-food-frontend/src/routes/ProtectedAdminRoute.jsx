import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../admin/context/AdminAuthContext";

export default function ProtectedAdminRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAdminAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <span>Checking access...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}