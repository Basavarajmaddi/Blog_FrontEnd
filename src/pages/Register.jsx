import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate("/login");
    } else {
      setError(resultAction.payload?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-300 flex flex-col md:flex-row font-sans transition-colors duration-300">
      <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#0c0c0e]">
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter mb-6">
          Start
          <br />
          writing.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-500 max-w-sm">
          Join a minimal space designed purely for your thoughts and ideas.
        </p>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-zinc-50 dark:bg-[#09090b]">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-8">Create Account</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1 pb-4">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              Join Now
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Already a member?{" "}
              <Link to="/login" className="text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
