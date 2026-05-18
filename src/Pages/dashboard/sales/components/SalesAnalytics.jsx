import { BarChart2, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../../../store/themeSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const SalesAnalytics = ({ completedOrders, totalStats }) => {
  const isDark = useSelector(selectThemeMode) === "dark";
  const tick   = isDark ? "#9ca3af" : "#6B8C7A";
  const grid   = isDark ? "#374151" : "#f0f0f0";
  const tip    = {
    borderRadius: 12, border: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    backgroundColor: isDark ? "#1f2937" : "#fff",
    color: isDark ? "#f9fafb" : "#1f2937",
  };
  const cardCls = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5";

  const customerMap = {};
  completedOrders.forEach((o) => {
    customerMap[o.customerName] = (customerMap[o.customerName] || 0) + (o.totalPayment || 0);
  });
  const barData = Object.entries(customerMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, revenue]) => ({
      name: name.length > 10 ? name.slice(0, 10) + "…" : name,
      revenue,
    }));

  const pieData = [
    { name: "Received", value: totalStats?.totalPaymentPaid    || 0 },
    { name: "Pending",  value: totalStats?.totalPaymentPending || 0 },
  ].filter((d) => d.value > 0);

  const empty = (
    <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
      No data yet
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className={`lg:col-span-2 ${cardCls}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-emerald-700" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Top Customers by Revenue</h3>
        </div>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: tick }} />
              <YAxis tick={{ fontSize: 12, fill: tick }} />
              <Tooltip contentStyle={tip} formatter={(v) => [`Rs ${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : empty}
      </div>

      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-emerald-700" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Payment Status</h3>
        </div>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                <Cell fill="#2D6A4F" />
                <Cell fill="#F4A261" />
              </Pie>
              <Tooltip contentStyle={tip} formatter={(v) => [`Rs ${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ color: isDark ? "#9ca3af" : undefined }} />
            </PieChart>
          </ResponsiveContainer>
        ) : empty}
      </div>
    </div>
  );
};

export default SalesAnalytics;