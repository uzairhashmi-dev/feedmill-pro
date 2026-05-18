const PercentBar = ({ total }) => {
  const isValid = Math.round(total) === 100;
  const width   = Math.min(total, 100);

  return (
    <div className={`rounded-2xl p-4 border ${
      isValid
        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    }`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${
          isValid ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        }`}>
          Total Ratio
        </span>
        <span className={`text-xl font-black ${
          isValid ? "text-emerald-700 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
        }`}>
          {total.toFixed(2)}%
        </span>
      </div>
      <div className="w-full bg-white/60 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isValid ? "bg-emerald-500" : total > 100 ? "bg-red-500" : "bg-amber-400"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      {!isValid && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
          {total > 100
            ? `Over by ${(total - 100).toFixed(2)}%`
            : `${(100 - total).toFixed(2)}% remaining`}
        </p>
      )}
    </div>
  );
};

export default PercentBar;