import { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApprovedPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`);
      const data = await res.json();
      console.log("Appointments API:", data);

      // Detect correct array
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.appointments)) list = data.appointments;

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
    <div className="text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Approved Patients</h1>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Patient Name</th>
              <th className="p-4 text-left text-sm font-semibold">Doctor</th>
              <th className="p-4 text-left text-sm font-semibold">Date</th>
              <th className="p-4 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500"
                >
                  No approved patients yet.
                </td>
              </tr>
            )}

            {patients.map((p) => (
              <tr
                key={p._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{p.patientName}</td>
                <td className="p-4">{p.doctorName}</td>
                <td className="p-4">
                  {p.date ? new Date(p.date).toLocaleString() : "—"}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 text-sm rounded-md bg-green-600 text-white">
                    Approved
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
