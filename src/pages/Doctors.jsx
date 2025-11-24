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
      const res = await fetch("https://aryacare-backend.onrender.com/api/docters");
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

      // Show preview
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit Form (Add / Edit)
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

    try {
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
    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  // Delete Doctor
  const deleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await fetch(`https://aryacare-backend.onrender.com/api/docters/${id}`, {
        method: "DELETE",
      });
      loadDoctors();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // Edit Doctor
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
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Doctors Management</h1>

      {/* Add doctor button */}
      <button
        className="px-5 py-3 mb-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
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
        ➕ Add Doctor
      </button>

      {/* Doctors Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Photo</th>
              <th className="p-4">Name</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Location</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doc) => (
              <tr
                key={doc._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <img
                    src={doc.image}
                    className="w-14 h-14 rounded-full shadow"
                    alt="doctor"
                  />
                </td>
                <td className="p-4 font-semibold">{doc.name}</td>
                <td className="p-4">{doc.specialization}</td>
                <td className="p-4">{doc.location}</td>
                <td className="p-4">{doc.experience} yrs</td>

                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDoctor(doc._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-7 rounded-xl shadow-xl w-96 relative">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              {editDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>

            {/* Image Preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-3 shadow"
                alt="Preview"
              />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              />

              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="Location"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              />

              <input
                type="text"
                name="gender"
                value={formData.gender}
                placeholder="Gender"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
              />

              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                placeholder="Specialization"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
              />

              <input
                type="text"
                name="experience"
                value={formData.experience}
                placeholder="Experience (years)"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
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
                className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                {editDoctor ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2 mt-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
