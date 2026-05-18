import { X, Edit3 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const ViewDrawer = ({ batch, onClose, onEdit }) => {
  const formulaName = batch.formula?.formulaName || "Formula Deleted";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900
                      border-l border-transparent dark:border-gray-800
                      w-full sm:max-w-md h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-white leading-tight truncate">{batch.feedName}</h3>
              <p className="text-emerald-200 text-xs mt-1 uppercase tracking-widest font-bold">
                #{batch._id?.slice(-8)}
              </p>
            </div>
            <button onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl ml-2">
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Formula",    val: formulaName },
              { label: "Target MT",  val: `${batch.targetMT} MT` },
              { label: "Total Cost", val: `Rs. ${batch.totalCost?.toLocaleString()}` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                <p className="text-emerald-200 text-[10px] uppercase tracking-wide">{label}</p>
                <p className="text-white font-bold text-xs mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Status
            </span>
            <StatusBadge status={batch.status} />
          </div>

          {batch.waste > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Waste</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{batch.waste} kg</span>
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Scaled Ingredients ({batch.scaledIngredients?.length || 0} items)
            </p>
            <div className="space-y-2">
              {batch.scaledIngredients?.map((ing, i) => (
                <div key={i}
                  className="flex justify-between items-center p-3.5
                             bg-gray-50 dark:bg-gray-800
                             rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{ing.key}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({ing.percentage}%)</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-gray-800 dark:text-white">
                      {ing.quantityKG?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1 font-bold uppercase">KG</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
            Created {new Date(batch.createdAt).toLocaleDateString()}
            {batch.created?.name && ` · by ${batch.created.name}`}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0">
          <button onClick={() => { onClose(); onEdit(batch); }}
            className="flex-1 flex items-center justify-center gap-2
                       border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300
                       py-2.5 rounded-xl text-sm font-medium
                       hover:bg-gray-50 dark:hover:bg-gray-800">
            <Edit3 size={15} /> Edit
          </button>
          <button onClick={onClose}
            className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDrawer;