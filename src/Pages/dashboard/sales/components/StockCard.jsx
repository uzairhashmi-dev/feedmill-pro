const StockCard = ({ s }) => {
  const soldPct = s.totalProductionKG > 0
    ? (s.soldKG / s.totalProductionKG) * 100
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900
                    rounded-xl border border-gray-100 dark:border-gray-800
                    shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate flex-1">
          {s.formulaName}
        </p>
        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20
                         text-emerald-600 dark:text-emerald-400
                         px-2 py-0.5 rounded font-mono ml-2 shrink-0">
          {s.formulaCode}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Produced</p>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {s.totalProductionKG.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">KG</p>
        </div>
        <div>
          <p className="text-[10px] text-amber-500 uppercase">Sold</p>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
            {s.soldKG.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">KG</p>
        </div>
        <div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase">Available</p>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {s.availableKG.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">KG</p>
        </div>
      </div>

      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
          style={{ width: `${Math.min(soldPct, 100)}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right">
        {soldPct.toFixed(1)}% sold
      </p>
    </div>
  );
};

export default StockCard;