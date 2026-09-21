import { Navigate, Outlet } from "react-router-dom";
import { getSalesmanSession } from "../services/salesmanService";

export default function ProtectedSalesmanRoute() {
  const session = getSalesmanSession();

  if (!session || !session.id) {
    return <Navigate to="/salesman/login" replace />;
  }

  return <Outlet />;
}
