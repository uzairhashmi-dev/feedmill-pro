import { BarChart2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../../../store/themeSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { PIE_COLORS } from "../constants";

const SummaryCharts = ({ inventoryStats, productionStats, orderStats }) => {
  // ✅ read theme so Recharts internals adapt to dark mode
  const themeMode = useSelector(selectThemeMode);
  const isDark    = themeMode === 'dark';

  const tickColor    = isDark ? '#9ca3af' : '#6B8C7A';
  const gridColor    = isDark ? '#374151' : '#f0f0f0';
  const tooltipStyle = {
    borderRadius: 12,
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f9fafb' : '#1f2937',
  };

  const barData = [
    { name: "Inv Orders",   value: inventoryStats?.totalOrders    || 0, fill: "#2D6A4F" },
    { name: "Prod Batches", value: productionStats?.totalBatches  || 0, fill: "#2196F3" },
    { name: "Sales Orders", value: orderStats?.totalOrders        || 0, fill: "#F4A261" },
  ];

  const invPieData = [
    { name: "Received", value: inventoryStats?.receivedOrders || 0 },
    { name: "Pending",  value: inventoryStats?.pendingOrders  || 0 },
    { name: "Placed",   value: inventoryStats?.placedOrders   || 0 },
  ].filter((d) => d.value > 0);

  const prodPieData = [
    { name: "Completed", value: productionStats?.completedBatches || 0 },
    { name: "Running",   value: productionStats?.runningBatches   || 0 },
    { name: "Queued",    value: productionStats?.queuedBatches    || 0 },
    { name: "Cancelled", value: productionStats?.cancelledBatches || 0 },
  ].filter((d) => d.value > 0);

  const emptyClass = "h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm";

  const cardClass = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      {/* Bar chart */}
      <div className={`lg:col-span-1 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-emerald-700" />
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Module Overview
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie — inventory */}
      <div className={cardClass}>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Inventory Status
        </h3>
        {invPieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={invPieData} cx="50%" cy="50%"
                   innerRadius={50} outerRadius={75}
                   paddingAngle={3} dataKey="value">
                {invPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={9}
                wrapperStyle={{ color: isDark ? '#9ca3af' : undefined }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className={emptyClass}>No data</div>
        )}
      </div>

      {/* Pie — production */}
      <div className={cardClass}>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Production Status
        </h3>
        {prodPieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={prodPieData} cx="50%" cy="50%"
                   innerRadius={50} outerRadius={75}
                   paddingAngle={3} dataKey="value">
                {prodPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={9}
                wrapperStyle={{ color: isDark ? '#9ca3af' : undefined }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className={emptyClass}>No data</div>
        )}
      </div>
    </div>
  );
};

export default SummaryCharts;