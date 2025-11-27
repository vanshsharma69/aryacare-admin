import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-xl rounded-xl px-10 py-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">AryaCare Admin</h1>
        <p className="text-center text-gray-600 mb-6">Login to continue</p>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <div className="flex items-center border rounded-lg px-3">
              <Mail size={20} className="text-gray-500" />
              <input
                type="email"
                className="w-full p-2 outline-none"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock size={20} className="text-gray-500" />
              <input
                type={showPass ? "text" : "password"}
                className="w-full p-2 outline-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-600"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-center">{error}</p>
          )}

          {/* Login Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
