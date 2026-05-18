import { BarChart2, Tag } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../../../store/themeSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PIE_COLORS } from "../constants";

const AnalyticsSection = ({ allCategories }) => {
  const isDark = useSelector(selectThemeMode) === "dark";
  const tick   = isDark ? "#9ca3af" : "#6B8C7A";
  const grid   = isDark ? "#374151" : "#f0f0f0";
  const tip    = { borderRadius:12, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", backgroundColor: isDark?"#1f2937":"#fff", color: isDark?"#f9fafb":"#1f2937" };
  const cardCls = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5";
  const empty   = <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No data yet</div>;

  const barData = allCategories.slice(0, 8).map((c) => ({
    name: c.categoryName.length > 10 ? c.categoryName.slice(0, 10) + "…" : c.categoryName,
    description: c.description?.length || 0,
  }));

  const withDesc    = allCategories.filter((c) => c.description?.trim()).length;
  const withoutDesc = allCategories.length - withDesc;
  const pieData = [
    { name: "With Description",    value: withDesc },
    { name: "Without Description", value: withoutDesc },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className={`lg:col-span-2 ${cardCls}`}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-emerald-700" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Categories Overview</h3>
        </div>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="name" tick={{ fontSize:12, fill:tick }} />
              <YAxis tick={{ fontSize:12, fill:tick }}
                label={{ value:"Desc Length", angle:-90, position:"insideLeft", style:{ fontSize:11, fill:tick } }} />
              <Tooltip contentStyle={tip} formatter={(v) => [v, "Description chars"]} />
              <Bar dataKey="description" fill="#2D6A4F" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : empty}
      </div>

      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <Tag size={18} className="text-emerald-700" />
          <h3 className="font-semibold text-gray-800 dark:text-white">Description Coverage</h3>
        </div>
        {allCategories.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%"
                   innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tip} />
              <Legend iconType="circle" iconSize={10}
                wrapperStyle={{ color: isDark ? "#9ca3af" : undefined }} />
            </PieChart>
          </ResponsiveContainer>
        ) : empty}
      </div>
    </div>
  );
};
export default AnalyticsSection;