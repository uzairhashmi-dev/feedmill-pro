const toKG = (quantity, unit) => {
  if (unit === "ton")   return Number(quantity) * 1000;
  if (unit === "liter") return Number(quantity) * 0.9;
  return Number(quantity);
};

const CostPreview = ({ costPerMT, quantity, unit }) => {
  if (!costPerMT || !quantity || !unit) return null;
  const totalKG   = toKG(quantity, unit);
  const totalCost = (costPerMT / 1000) * totalKG;
  if (!totalCost) return null;

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20
                    border border-emerald-200 dark:border-emerald-800
                    p-4 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Estimated Total Cost
          </p>
          <p className="text-xl font-black text-emerald-800 dark:text-emerald-300">
            Rs. {Math.round(totalCost).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Converted</p>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {totalKG.toLocaleString()} kg
          </p>
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400">
        <span>Rate: Rs. {costPerMT?.toLocaleString()}/MT</span>
        <span>{quantity} {unit} → {totalKG} kg</span>
      </div>
    </div>
  );
};

export default CostPreview;