import { useEffect, useState } from "react";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    gender: "",
    specialization: "",
    experience: "",
    image: null,
  });

  // Fetch doctors
  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/docters`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.log("Error loading doctors:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) form.append(key, formData[key]);
    });

    const url = editDoctor
      ? `https://aryacare-backend.onrender.com/api/docters/${editDoctor._id}`
      : "https://aryacare-backend.onrender.com/api/docters/create";

    const method = editDoctor ? "PUT" : "POST";

    await fetch(url, { method, body: form });

    setModalOpen(false);
    setEditDoctor(null);
    setFormData({
      name: "",
      location: "",
      gender: "",
      specialization: "",
      experience: "",
      image: null,
    });
    setImagePreview(null);

    loadDoctors();
  };

  // Delete
  const deleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    await fetch(`https://aryacare-backend.onrender.com/api/docters/${id}`, {
      method: "DELETE",
    });

    loadDoctors();
  };

  // Edit
  const handleEdit = (doctor) => {
    setEditDoctor(doctor);
    setImagePreview(doctor.image);
    setFormData({
      name: doctor.name,
      location: doctor.location,
      gender: doctor.gender,
      specialization: doctor.specialization,
      experience: doctor.experience,
      image: null,
    });
    setModalOpen(true);
  };

  return (
    <div className="text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Doctors Management</h1>

      {/* Add Doctor Button */}
      <button
        className="px-5 py-2 mb-6 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition"
        onClick={() => {
          setEditDoctor(null);
          setImagePreview(null);
          setFormData({
            name: "",
            location: "",
            gender: "",
            specialization: "",
            experience: "",
            image: null,
          });
          setModalOpen(true);
        }}
      >
        + Add Doctor
      </button>

      {/* Doctors Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Photo</th>
              <th className="p-4 text-left text-sm font-semibold">Name</th>
              <th className="p-4 text-left text-sm font-semibold">Specialization</th>
              <th className="p-4 text-left text-sm font-semibold">Location</th>
              <th className="p-4 text-left text-sm font-semibold">Experience</th>
              <th className="p-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <img
                    src={doc.image}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                    alt="doctor"
                  />
                </td>
                <td className="p-4 font-medium">{doc.name}</td>
                <td className="p-4">{doc.specialization}</td>
                <td className="p-4">{doc.location}</td>
                <td className="p-4">{doc.experience} yrs</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-black transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDoctor(doc._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-7 rounded-xl shadow-xl w-96 relative">
            <h2 className="text-xl font-semibold mb-5">
              {editDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-gray-300"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Specialization"
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Experience (years)"
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
              />

              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {editDoctor ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-3 mt-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
