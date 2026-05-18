import { Calendar } from "lucide-react";
import { PERIOD_BUTTONS } from "../constants";

const PeriodSelector = ({
  period, onPeriodChange,
  customStart, customEnd,
  onCustomStartChange, onCustomEndChange,
  onCustomApply, loading,
}) => (
  <div className="bg-white dark:bg-gray-900
                  rounded-2xl shadow-sm
                  border border-gray-100 dark:border-gray-800
                  p-4 mb-6">
    <div className="flex flex-wrap items-center gap-2">

      {PERIOD_BUTTONS.map((btn) => (
        <button
          key={btn.key}
          onClick={() => onPeriodChange(btn.key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium
                      transition-all ${
            period === btn.key
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {btn.label}
        </button>
      ))}

      {period === "custom" && (
        <div className="flex flex-wrap items-center gap-2 mt-2 w-full
                        sm:mt-0 sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800
                         text-gray-800 dark:text-white
                         rounded-xl px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-300
                         dark:focus:ring-emerald-700"
            />
          </div>
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => onCustomEndChange(e.target.value)}
            className="border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       text-gray-800 dark:text-white
                       rounded-xl px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-300
                       dark:focus:ring-emerald-700"
          />
          <button
            onClick={onCustomApply}
            disabled={loading}
            className="bg-emerald-700 text-white px-4 py-2 rounded-xl
                       text-sm font-medium hover:bg-emerald-800
                       disabled:opacity-60 transition-all"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  </div>
);

export default PeriodSelector;