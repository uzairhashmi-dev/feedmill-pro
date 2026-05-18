import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { WifiOff, AlertTriangle } from "lucide-react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export default function NetworkStatus() {
  const { isOnline, isSlow } = useNetworkStatus();

  // Net wapas aaya → success toast
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        toast.success("Connection restored!", {
          icon: "🌐",
          duration: 3000,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // Slow internet → warning toast
  useEffect(() => {
    if (isSlow && isOnline) {
      toast("Slow internet detected", {
        icon: <AlertTriangle size={16} className="text-amber-500" />,
        duration: 4000,
        style: {
          background: "#fffbeb",
          color: "#92400e",
          border: "1px solid #fde68a",
        },
      });
    }
  }, [isSlow, isOnline]);

  // Net OFF → blocking modal
  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm
                      flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900
                        border border-transparent dark:border-gray-800
                        rounded-2xl w-full max-w-sm shadow-2xl p-8 text-center">

          {/* Animated icon */}
          <div className="w-20 h-20
                          bg-red-50 dark:bg-red-900/30
                          rounded-full flex items-center justify-center
                          mx-auto mb-6 animate-pulse">
            <WifiOff size={36} className="text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            No Internet Connection
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
            Please check your network connection.
            The app will resume automatically when you're back online.
          </p>

          {/* Animated dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-red-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <p className="text-[11px] text-gray-400 dark:text-gray-500
                        mt-4 uppercase tracking-widest">
            FeedMill Pro — Waiting for connection
          </p>
        </div>
      </div>
    );
  }

  // Slow internet → top banner
  if (isSlow) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9998]
                      bg-amber-400 dark:bg-amber-500
                      px-4 py-2 flex items-center justify-center gap-2">
        <AlertTriangle size={15} className="text-amber-900 shrink-0" />
        <p className="text-amber-900 text-xs font-semibold">
          Slow internet detected — some features may take longer to load
        </p>
      </div>
    );
  }

  return null;
}