import { useEffect, useState } from "react";
import Card from "../components/Card";

export default function Dashboard() {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [docRes, appRes] = await Promise.all([
        fetch("https://aryacare-backend.onrender.com/api/docters"),
        fetch("https://aryacare-backend.onrender.com/api/appointments")
      ]);

      const doctors = await docRes.json();
      const data = await appRes.json();

      // Set doctors count
      setTotalDoctors(doctors.length);

      // Detect appointments array format
      let appointments = [];
      if (Array.isArray(data)) appointments = data;
      else if (Array.isArray(data.data)) appointments = data.data;
      else if (Array.isArray(data.appointments)) appointments = data.appointments;

      setTotalAppointments(appointments.length);

      // Patients = Approved Appointments
      const approvedPatients = appointments.filter(a => a.status === "Approved");
      setTotalPatients(approvedPatients.length);

    } catch (err) {
      console.log("Stats Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-gray-600">Loading data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Patients" value={totalPatients} />
        <Card title="Total Doctors" value={totalDoctors} />
        <Card title="Appointments" value={totalAppointments} />
      </div>
    </div>
  );
}