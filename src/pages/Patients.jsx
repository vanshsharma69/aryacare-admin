import { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApprovedPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://aryacare-backend.onrender.com/api/appointments");
      const data = await res.json();
      console.log("Appointments API:", data);

      // Detect correct array from API
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.appointments)) list = data.appointments;

      // Filter only approved
      const approved = list.filter((a) => a.status === "Approved");

      setPatients(approved);
    } catch (err) {
      console.log("Error:", err);
      setPatients([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApprovedPatients();
  }, []);

  if (loading) return <p className="text-xl">Loading patients...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Approved Patients</h1>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Patient Name</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {patients.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-5 text-gray-500">
                No approved patients yet.
              </td>
            </tr>
          )}

          {patients.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-3">{p.patientName}</td>
              <td className="p-3">{p.doctorName}</td>
              <td className="p-3">{new Date(p.date).toLocaleString()}</td>

              <td className="p-3">
                <span className="px-3 py-1 rounded text-white bg-green-600">
                  Approved
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
