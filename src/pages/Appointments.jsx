import { useEffect, useState } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://aryacare-backend.onrender.com/api/appointments");
      const data = await res.json();
      console.log("API Response:", data);

      // 🔥 Auto-detect correct array format
      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (Array.isArray(data.data)) {
        setAppointments(data.data);
      } else if (Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        console.error("No array found in API response");
        setAppointments([]);
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setAppointments([]);
    }
    setLoading(false);
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    if (!confirm("Are you sure?")) return;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments/${id}`, {
      method: "DELETE",
    });
    loadAppointments();
  };

  // Update status (Approved / Pending)
  const changeStatus = async (id, status) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadAppointments();
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) return <p className="text-xl">Loading appointments...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Appointments</h1>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Patient</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-5 text-gray-500">
                No appointments available.
              </td>
            </tr>
          )}

          {appointments.map((a) => (
            <tr key={a._id} className="border-b">
              <td className="p-3">{a.patientName}</td>
              <td className="p-3">{a.doctorName}</td>
              <td className="p-3">
                {a.date ? new Date(a.date).toLocaleString() : "—"}
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded text-white ${
                    a.status === "Approved"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {a.status || "Pending"}
                </span>
              </td>

              <td className="p-3 flex gap-3">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => changeStatus(a._id, "Approved")}
                >
                  Approve
                </button>

                <button
                  className="px-3 py-1 bg-orange-500 text-white rounded"
                  onClick={() => changeStatus(a._id, "Pending")}
                >
                  Pending
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteAppointment(a._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
