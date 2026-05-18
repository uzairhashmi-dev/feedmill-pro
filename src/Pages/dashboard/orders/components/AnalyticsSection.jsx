import { BarChart2, TrendingUp, Package } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../../../store/themeSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PIE_COLORS } from "../constants";

const AnalyticsSection = ({ allOrders, stockSummary }) => {
  const isDark = useSelector(selectThemeMode) === "dark";
  const tick   = isDark ? "#9ca3af" : "#6B8C7A";
  const grid   = isDark ? "#374151" : "#f0f0f0";
  const tip    = { borderRadius:12, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", backgroundColor:isDark?"#1f2937":"#fff", color:isDark?"#f9fafb":"#1f2937" };
  const cardCls = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5";
  const empty   = <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No data yet</div>;

  const customerMap = {};
  allOrders.forEach((o) => {
    if (!customerMap[o.customerName]) customerMap[o.customerName] = 0;
    customerMap[o.customerName] += o.totalPayment || 0;
  });
  const barData = Object.entries(customerMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, total]) => ({ name: name.length > 10 ? name.slice(0,10)+"…" : name, total }));

  const statusCount = {};
  allOrders.forEach((o) => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
  const pieData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 mb-6">

      {/* Stock summary cards */}
      {stockSummary.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-emerald-700" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Formula Stock Availability
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stockSummary.map((s) => {
              const availPct = s.totalProductionKG > 0
                ? Math.round((s.availableKG / s.totalProductionKG) * 100) : 0;
              const barColor = availPct > 50 ? "bg-emerald-500" : availPct > 20 ? "bg-amber-400" : "bg-red-500";
              return (
                <div key={s.formulaId}
                  className="bg-white dark:bg-gray-900
                             rounded-xl border border-gray-100 dark:border-gray-800
                             p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-35">{s.formulaName}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">{s.formulaCode}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      availPct > 50 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : availPct > 20 ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {availPct}% left
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                    <div className={`h-1.5 rounded-full ${barColor}`} style={{ width:`${availPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                    <span>{s.availableKG.toLocaleString()} kg avail</span>
                    <span>{s.soldKG.toLocaleString()} kg sold</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <Tooltip contentStyle={tip} formatter={(v) => [`Rs ${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="total" fill="#2D6A4F" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : empty}
        </div>

        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-700" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Order Status</h3>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                     innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tip} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ color:isDark?"#9ca3af":undefined }} />
              </PieChart>
            </ResponsiveContainer>
          ) : empty}
        </div>
      </div>
    </div>
  );
};
export default AnalyticsSection;