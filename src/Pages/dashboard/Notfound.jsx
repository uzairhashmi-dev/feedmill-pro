import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Wheat, Home, LogIn, AlertTriangle } from "lucide-react";
import { selectUser } from "../../store/authSlice";

export default function NotFound() {
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  return (
    <div className="min-h-screen bg-[#f4f7f4] dark:bg-gray-950
                    flex flex-col items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md
                      bg-white dark:bg-gray-900
                      border border-transparent dark:border-gray-800
                      rounded-2xl shadow-xl overflow-hidden">

        {/* Top — dark header */}
        <div className="bg-[#1c3a1c] px-8 py-8 text-center">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
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

          {/* 404 */}
          <div className="relative">
            <p className="text-[120px] font-black text-white/5
                          leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex flex-col
                            items-center justify-center">
              <div className="w-16 h-16
                              bg-[#4ade80]/10
                              border border-[#4ade80]/20
                              rounded-2xl flex items-center
                              justify-center mb-3">
                <AlertTriangle size={28} className="text-[#4ade80]" />
              </div>
              <p className="text-white font-bold text-xl">Page Not Found</p>
            </div>
          </div>
        </div>

        {/* Bottom — content */}
        <div className="px-8 py-7 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Yeh page exist nahi karta ya aap ka is tak access nahi hai.
            <br />
            Ghabrao nahi — wapas chalte hain.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => navigate("/dashboard", { replace: true })}
                className="w-full bg-[#1c3a1c] hover:bg-[#2d5a2d]
                           text-white py-3 rounded-xl text-sm font-semibold
                           transition-colors flex items-center
                           justify-center gap-2">
                <Home size={16} />
                Back to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="w-full bg-[#1c3a1c] hover:bg-[#2d5a2d]
                           text-white py-3 rounded-xl text-sm font-semibold
                           transition-colors flex items-center
                           justify-center gap-2">
                <LogIn size={16} />
                Go to Login
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className="w-full
                         border border-gray-200 dark:border-gray-700
                         text-gray-500 dark:text-gray-400
                         hover:bg-gray-50 dark:hover:bg-gray-800
                         py-3 rounded-xl text-sm font-medium transition-colors">
              ← Go Back
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-600 mt-6">
            FeedMill Pro ERP — v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}