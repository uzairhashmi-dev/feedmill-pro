import { useState } from "react";
import { X } from "lucide-react";

const FilterPanel = ({ onFilter, onClose }) => {
  const [f, setF] = useState({ search:"", status:"", startDate:"", endDate:"", minPrice:"", maxPrice:"" });
  const apply = () => { onFilter(f); onClose(); };
  const inputCls = "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700";

  return (
    <div className="absolute right-0 top-12 z-30
                    bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-700
                    rounded-2xl shadow-xl p-5 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">Advanced Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Status</label>
          <select className={inputCls} value={f.status} onChange={(e) => setF({...f, status: e.target.value})}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Placed">Placed</option>
            <option value="Received">Received</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">From Date</label>
            <input type="date" className={inputCls} value={f.startDate} onChange={(e) => setF({...f, startDate: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">To Date</label>
            <input type="date" className={inputCls} value={f.endDate} onChange={(e) => setF({...f, endDate: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Min Price (Rs)</label>
            <input type="number" placeholder="0" className={inputCls} value={f.minPrice} onChange={(e) => setF({...f, minPrice: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Max Price (Rs)</label>
            <input type="number" placeholder="99999" className={inputCls} value={f.maxPrice} onChange={(e) => setF({...f, maxPrice: e.target.value})} />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setF({ search:"", status:"", startDate:"", endDate:"", minPrice:"", maxPrice:"" })}
          className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
          Clear
        </button>
        <button onClick={apply} className="flex-1 bg-emerald-700 text-white py-2 rounded-lg text-sm hover:bg-emerald-800">Apply</button>
      </div>
    </div>
  );
};
export default FilterPanel;