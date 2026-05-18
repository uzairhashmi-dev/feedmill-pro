const StatCard = ({ title, value, icon, gradient, sub }) => (
  <div className="bg-white dark:bg-gray-900
                  rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800
                  p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`${gradient} p-3.5 rounded-xl text-white shrink-0`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide truncate">{title}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">{value ?? 0}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);
export default StatCard;