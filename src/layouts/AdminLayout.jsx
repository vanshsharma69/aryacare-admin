import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  // Hide layout on login page
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
