import { useState, useEffect } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlow,   setIsSlow]   = useState(false);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const checkSpeed = () => {
      if (!connection) return;
      setIsSlow(["slow-2g", "2g"].includes(connection.effectiveType));
    };

    checkSpeed();
    connection?.addEventListener("change", checkSpeed);

    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
      connection?.removeEventListener("change", checkSpeed);
    };
  }, []);

  return { isOnline, isSlow };
};