import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-300 flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900 transition-colors duration-300">
      <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#0c0c0e]">
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter mb-6">
          Welcome
          <br />
          back.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-500 max-w-sm">
          Access your account to continue reading and sharing your ideas.
        </p>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-zinc-50 dark:bg-[#09090b]">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-8">Sign In</h2>
          {error && <p className="text-red-500 mb-4">{error.message || "Login failed"}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={loading}
              className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
