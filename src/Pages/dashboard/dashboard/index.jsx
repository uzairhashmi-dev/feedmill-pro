import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  fetchDashboardStats,
  setPeriod, setCustomStart, setCustomEnd,
  selectPeriod, selectCustomStart, selectCustomEnd,
  selectInventoryStats, selectProductionStats,
  selectOrderStats, selectDashboardLoading,
} from "../../../store/dashboardSlice";

import PeriodSelector   from "./components/PeriodSelector";
import InventorySection from "./components/InventorySection";
import ProductionSection from "./components/ProductionSection";
import OrdersSection    from "./components/OrdersSection";
import SummaryCharts    from "./components/SummaryCharts";

const Dashboard = () => {
  const dispatch = useDispatch();

  const period          = useSelector(selectPeriod);
  const customStart     = useSelector(selectCustomStart);
  const customEnd       = useSelector(selectCustomEnd);
  const inventoryStats  = useSelector(selectInventoryStats);
  const productionStats = useSelector(selectProductionStats);
  const orderStats      = useSelector(selectOrderStats);
  const loading         = useSelector(selectDashboardLoading);

  // ✅ Same as init() in old hook — monthly on mount
  useEffect(() => {
    dispatch(fetchDashboardStats({ period: 'monthly' }));
  }, [dispatch]);

  // ✅ Same as handlePeriodChange
  const handlePeriodChange = useCallback((newPeriod) => {
    dispatch(setPeriod(newPeriod));
    if (newPeriod !== 'custom') {
      dispatch(fetchDashboardStats({ period: newPeriod }));
    }
    // custom → wait for user to pick dates and press Apply
  }, [dispatch]);

  // ✅ Same as handleCustomApply
  const handleCustomApply = useCallback(() => {
    if (!customStart || !customEnd) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (new Date(customStart) > new Date(customEnd)) {
      toast.error("Start date must be before end date");
      return;
    }
    dispatch(fetchDashboardStats({ period: 'custom', customStart, customEnd }));
  }, [dispatch, customStart, customEnd]);

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent
                    p-4 md:p-5 lg:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          FeedMill operations overview
        </p>
      </div>

      <PeriodSelector
        period={period}
        onPeriodChange={handlePeriodChange}
        customStart={customStart}
        customEnd={customEnd}
        onCustomStartChange={(v) => dispatch(setCustomStart(v))}
        onCustomEndChange={(v)   => dispatch(setCustomEnd(v))}
        onCustomApply={handleCustomApply}
        loading={loading}
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 size={36} className="animate-spin text-emerald-700" />
            <p className="text-sm dark:text-gray-500">Loading dashboard data…</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          <SummaryCharts
            inventoryStats={inventoryStats}
            productionStats={productionStats}
            orderStats={orderStats}
          />
          <InventorySection  stats={inventoryStats}  loading={loading} />
          <ProductionSection stats={productionStats} loading={loading} />
          <OrdersSection     stats={orderStats}      loading={loading} />

          {/* Empty state */}
          {!inventoryStats && !productionStats && !orderStats && (
            <div className="flex flex-col items-center justify-center
                            py-20 text-gray-400 dark:text-gray-600">
              <p className="text-base font-medium">No data available</p>
              <p className="text-sm mt-1">
                Try a different period or add some data first
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;