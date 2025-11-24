import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarClock,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const linkClasses =
    "flex items-center gap-3 p-3 rounded-lg transition font-medium";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-5 flex flex-col justify-between z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <div>
          <h1 className="text-2xl font-bold mb-8 mt-12 md:mt-0">
            AryaCare Admin
          </h1>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={() => window.innerWidth < 768 && setOpen(false)}
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive
                    ? "bg-blue-600 font-semibold shadow-lg"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>

            <NavLink
              to="/patients"
              onClick={() => window.innerWidth < 768 && setOpen(false)}
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive
                    ? "bg-blue-600 font-semibold shadow-lg"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <Users size={20} />
              Patients
            </NavLink>

            <NavLink
              to="/doctors"
              onClick={() => window.innerWidth < 768 && setOpen(false)}
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive
                    ? "bg-blue-600 font-semibold shadow-lg"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <Stethoscope size={20} />
              Doctors
            </NavLink>

            <NavLink
              to="/appointments"
              onClick={() => window.innerWidth < 768 && setOpen(false)}
              className={({ isActive }) =>
                `${linkClasses} ${
                  isActive
                    ? "bg-blue-600 font-semibold shadow-lg"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <CalendarClock size={20} />
              Appointments
            </NavLink>
          </nav>
        </div>

        {/* 🔥 Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 mt-5 rounded-lg hover:bg-red-600 bg-red-500 transition font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>
    </>
  );
}
