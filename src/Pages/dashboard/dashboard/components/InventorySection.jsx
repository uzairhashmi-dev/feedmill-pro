import {
  Package, CheckCircle, Clock,
  ShoppingCart, DollarSign,
} from "lucide-react";
import StatCard from "./StatCard";

const InventorySection = ({ stats, loading }) => {
  if (loading) return null;

  const received = stats?.receivedOrders ?? 0;
  const pending  = stats?.pendingOrders  ?? 0;
  const placed   = stats?.placedOrders   ?? 0;
  const total    = stats?.totalOrders    ?? 0;

  const cards = [
    {
      title:    "Total Orders",
      value:    total,
      icon:     <ShoppingCart size={20} />,
      gradient: "bg-gradient-to-br from-emerald-700 to-emerald-500",
      sub:      `${received} received · ${pending} pending · ${placed} placed`,
    },
    {
      title:    "Received",
      value:    received,
      icon:     <CheckCircle size={20} />,
      gradient: "bg-gradient-to-br from-teal-600 to-teal-400",
      sub:      received > 0
                  ? `${Math.round((received / total) * 100)}% of total orders received`
                  : "No items received yet",
    },
    {
      title:    "Pending",
      value:    pending,
      icon:     <Clock size={20} />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-400",
      sub:      pending > 0
                  ? `${pending} order${pending !== 1 ? "s" : ""} awaiting delivery`
                  : "No pending orders",
    },
    {
      title:    "Placed",
      value:    placed,
      icon:     <Package size={20} />,
      gradient: "bg-gradient-to-br from-blue-600 to-blue-400",
      sub:      placed > 0
                  ? `${placed} order${placed !== 1 ? "s" : ""} sent to vendor`
                  : "No placed orders",
    },
    {
      title:    "Total Value",
      value:    `Rs ${(stats?.totalPrice ?? 0).toLocaleString()}`,
      icon:     <DollarSign size={20} />,
      gradient: "bg-gradient-to-br from-purple-600 to-purple-400",
      sub:      `Across ${received} received item${received !== 1 ? "s" : ""}`,
    },
    {
      title:    "Total Qty (kg)",
      value:    `${(stats?.totalQuantity ?? 0).toLocaleString()} kg`,
      icon:     <Package size={20} />,
      gradient: "bg-gradient-to-br from-cyan-600 to-cyan-400",
      sub:      `From ${received} received order${received !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-emerald-600 rounded-full" />
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Inventory Overview
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {cards.map((c) => <StatCard key={c.title} {...c} />)}
      </div>
    </div>
  );
};

export default InventorySection;