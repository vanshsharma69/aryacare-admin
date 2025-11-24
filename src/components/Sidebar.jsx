import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-6">AryaCare Admin</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:bg-blue-700 p-3 rounded">Dashboard</Link>
        <Link to="/patients" className="hover:bg-blue-700 p-3 rounded">Patients</Link>
        <Link to="/doctors" className="hover:bg-blue-700 p-3 rounded">Doctors</Link>
        <Link to="/appointments" className="hover:bg-blue-700 p-3 rounded">Appointments</Link>
      </nav>
    </div>
  );
}
