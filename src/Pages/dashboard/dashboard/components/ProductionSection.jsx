import { Play, CheckCircle, Clock, DollarSign, Package } from "lucide-react";
import StatCard from "./StatCard";

const ProductionSection = ({ stats, loading }) => {
  if (loading) return null;

  const total     = stats?.totalBatches     ?? 0;
  const completed = stats?.completedBatches ?? 0;
  const running   = stats?.runningBatches   ?? 0;
  const queued    = stats?.queuedBatches    ?? 0;
  const cancelled = stats?.cancelledBatches ?? 0;
  const output    = stats?.totalProduction  ?? 0;
  const waste     = stats?.totalWaste       ?? 0;
  const cost      = stats?.totalCost        ?? 0;

  const wastePercent = output + waste > 0
    ? Math.round((waste / (output + waste)) * 100) : 0;

  const cards = [
    {
      title:    "Total Batches",
      value:    total,
      icon:     <Play size={20} fill="currentColor" />,
      gradient: "bg-gradient-to-br from-emerald-700 to-emerald-500",
      sub:      `${completed} completed · ${running} running · ${cancelled} cancelled`,
    },
    {
      title:    "Completed",
      value:    completed,
      icon:     <CheckCircle size={20} />,
      gradient: "bg-gradient-to-br from-teal-600 to-teal-400",
      sub:      completed > 0 && total > 0
                  ? `${Math.round((completed / total) * 100)}% completion rate`
                  : "No completed batches",
    },
    {
      title:    "Running",
      value:    running,
      icon:     <Clock size={20} />,
      gradient: "bg-gradient-to-br from-blue-600 to-blue-400",
      sub:      running > 0
                  ? `${running} batch${running !== 1 ? "es" : ""} in progress`
                  : "No active batches",
    },
    {
      title:    "Queued",
      value:    queued,
      icon:     <Clock size={20} />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-400",
      sub:      queued > 0
                  ? `${queued} batch${queued !== 1 ? "es" : ""} waiting to start`
                  : "No queued batches",
    },
    {
      title:    "Total Cost",
      value:    `Rs ${cost.toLocaleString()}`,
      icon:     <DollarSign size={20} />,
      gradient: "bg-gradient-to-br from-purple-600 to-purple-400",
      sub:      completed > 0
                  ? `Avg Rs ${Math.round(cost / completed).toLocaleString()} per batch`
                  : "No completed batches yet",
    },
    {
      title:    "Output (kg)",
      value:    `${output.toLocaleString()} kg`,
      icon:     <Package size={20} />,
      gradient: "bg-gradient-to-br from-cyan-600 to-cyan-400",
      sub:      `Waste: ${waste.toLocaleString()} kg (${wastePercent}% loss)`,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Production Overview
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {cards.map((c) => <StatCard key={c.title} {...c} />)}
      </div>
    </div>
  );
};

export default ProductionSection;