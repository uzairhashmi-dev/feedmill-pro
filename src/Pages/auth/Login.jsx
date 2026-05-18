import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff, Wheat, Sun, Moon } from "lucide-react";

import { loginThunk, selectAuthLoading, selectAuthError, clearError } from "../../store/authSlice";
import { toggleTheme, selectThemeMode } from "../../store/themeSlice";

export default function Login() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  // ✅ loading & error now come from Redux — no local state for these
  const loading   = useSelector(selectAuthLoading);
  const reduxError = useSelector(selectAuthError);
  const themeMode = useSelector(selectThemeMode);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState(""); // only for empty field check

  const error = localError || reduxError; // local validation first, then server error

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    if (!username.trim() || !password.trim()) {
      setLocalError("Username aur password zaroori hai");
      return;
    }

    setLocalError("");
    dispatch(clearError()); // clear previous Redux error

    const result = await dispatch(
      loginThunk({ username: username.trim(), password })
    );

    if (loginThunk.fulfilled.match(result)) {
      // ✅ same as before — navigate to dashboard on success
      navigate("/dashboard", { replace: true });
    }
    // if rejected — reduxError selector picks up the message automatically
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] dark:bg-gray-950
                    flex items-center justify-center px-4 transition-colors">

      {/* ── Theme toggle — top right corner ── */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="fixed top-4 right-4 p-2.5
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   rounded-xl shadow-sm text-gray-500 dark:text-gray-400
                   hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors z-10"
        title={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {themeMode === "dark"
          ? <Sun  size={17} className="text-yellow-400" />
          : <Moon size={17} />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-900
                      rounded-2xl shadow-xl overflow-hidden
                      border border-transparent dark:border-gray-800">

        {/* ── Header band — same dark green, unchanged ── */}
        <div className="bg-[#1c3a1c] px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#4ade80]/20 rounded-xl
                            flex items-center justify-center">
              <Wheat size={22} className="text-[#4ade80]" />
            </div>
            <div className="text-left">
              <h1 className="text-white font-bold text-xl leading-none">
                FeedMill Pro
              </h1>
              <p className="text-[#4ade80]/70 text-xs">ERP SYSTEM</p>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-3">
            Sign in to your account to continue
          </p>
        </div>

        {/* ── Form body ── */}
        <div className="px-8 py-8">

          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/40
                            border border-red-200 dark:border-red-800
                            text-red-600 dark:text-red-400
                            text-sm rounded-xl px-4 py-3 mb-5">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium
                                text-gray-700 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full border border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           text-gray-900 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:border-[#1c3a1c] dark:focus:border-[#4ade80]
                           focus:ring-1 focus:ring-[#1c3a1c] dark:focus:ring-[#4ade80]
                           transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium
                                text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-gray-300 dark:border-gray-700
                             bg-white dark:bg-gray-800
                             text-gray-900 dark:text-white
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             rounded-xl px-4 py-2.5 pr-11 text-sm
                             focus:outline-none focus:border-[#1c3a1c] dark:focus:border-[#4ade80]
                             focus:ring-1 focus:ring-[#1c3a1c] dark:focus:ring-[#4ade80]
                             transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600
                             dark:text-gray-500 dark:hover:text-gray-300
                             transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1c3a1c] hover:bg-[#2d5a2d]
                         text-white py-2.5 rounded-xl text-sm font-medium
                         transition-colors disabled:opacity-50
                         flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
            FeedMill Pro ERP — Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}