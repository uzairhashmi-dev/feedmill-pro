import { BarChart2, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../../../store/themeSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PIE_COLORS } from "../constants";

const AnalyticsSection = ({ allCustomers }) => {
  const isDark = useSelector(selectThemeMode) === "dark";
  const tick   = isDark ? "#9ca3af" : "#6B8C7A";
  const grid   = isDark ? "#374151" : "#f0f0f0";
  const tip    = { borderRadius:12, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", backgroundColor: isDark?"#1f2937":"#fff", color: isDark?"#f9fafb":"#1f2937" };
  const cardCls = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5";
  const empty   = <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No data yet</div>;

  const barData = allCustomers.slice(0, 6).map((c) => ({
    name:    c.customerName.length > 10 ? c.customerName.slice(0, 10) + "..." : c.customerName,
    revenue: Math.round(c.totalRevenue),
    orders:  c.totalOrders,
  }));

  const outstandingCount = allCustomers.filter((c) => c.hasOutstanding).length;
  const pieData = [
    { name: "Payment Clear",       value: allCustomers.length - outstandingCount },
    { name: "Outstanding Payment", value: outstandingCount },
  ].filter((d) => d.value > 0);

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
              <XAxis dataKey="name" tick={{ fontSize:12, fill:tick }} />
              <YAxis tick={{ fontSize:12, fill:tick }} />
              <Tooltip contentStyle={tip}
                formatter={(v, name) => [
                  name === "revenue" ? `Rs ${v.toLocaleString()}` : v,
                  name === "revenue" ? "Revenue" : "Orders",
                ]} />
              <Bar dataKey="revenue" fill="#2D6A4F" radius={[6,6,0,0]} />
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
              <Pie data={pieData} cx="50%" cy="50%"
                   innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tip} />
              <Legend iconType="circle" iconSize={10}
                wrapperStyle={{ color: isDark?"#9ca3af":undefined }} />
            </PieChart>
          </ResponsiveContainer>
        ) : empty}
      </div>
    </div>
  );
};
export default AnalyticsSection;