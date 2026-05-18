import {
  ShoppingBag, CheckCircle, Clock,
  DollarSign, TrendingUp, AlertTriangle,
} from "lucide-react";
import StatCard from "./StatCard";

const OrdersSection = ({ stats, loading }) => {
  if (loading) return null;

  const total     = stats?.totalOrders         ?? 0;
  const completed = stats?.completedOrders      ?? 0;
  const pending   = stats?.pendingOrders        ?? 0;
  const cancelled = stats?.cancelledOrders      ?? 0;
  const revenue   = stats?.totalAmount          ?? 0;
  const paid      = stats?.totalPaymentPaid     ?? 0;
  const unpaid    = stats?.totalPaymentPending  ?? 0;
  const kgSold    = stats?.totalQuantityKG      ?? 0;

  const recoveryRate = revenue > 0 ? Math.round((paid / revenue) * 100) : 0;

  const cards = [
    {
      title:    "Total Orders",
      value:    total,
      icon:     <ShoppingBag size={20} />,
      gradient: "bg-gradient-to-br from-emerald-700 to-emerald-500",
      sub:      `${completed} completed · ${pending} pending · ${cancelled} cancelled`,
    },
    {
      title:    "Completed",
      value:    completed,
      icon:     <CheckCircle size={20} />,
      gradient: "bg-gradient-to-br from-teal-600 to-teal-400",
      sub:      completed > 0 && total > 0
                  ? `${Math.round((completed / total) * 100)}% order fulfillment rate`
                  : "No completed orders",
    },
    {
      title:    "Pending",
      value:    pending,
      icon:     <Clock size={20} />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-400",
      sub:      pending > 0
                  ? `${pending} order${pending !== 1 ? "s" : ""} awaiting delivery`
                  : "All orders fulfilled",
    },
    {
      title:    "Revenue",
      value:    `Rs ${revenue.toLocaleString()}`,
      icon:     <DollarSign size={20} />,
      gradient: "bg-gradient-to-br from-blue-600 to-blue-400",
      sub:      `${kgSold.toLocaleString()} kg sold across ${total} order${total !== 1 ? "s" : ""}`,
    },
    {
      title:    "Payment Received",
      value:    `Rs ${paid.toLocaleString()}`,
      icon:     <TrendingUp size={20} />,
      gradient: "bg-gradient-to-br from-purple-600 to-purple-400",
      sub:      `${recoveryRate}% payment recovery rate`,
    },
    {
      title:    "Payment Pending",
      value:    `Rs ${unpaid.toLocaleString()}`,
      icon:     <AlertTriangle size={20} />,
      gradient: "bg-gradient-to-br from-red-500 to-red-400",
      sub:      unpaid > 0
                  ? `Outstanding from ${pending + completed} active order${(pending + completed) !== 1 ? "s" : ""}`
                  : "All payments cleared",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-amber-500 rounded-full" />
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Sales & Orders Overview
        </h3>
      </div>
      <div className="grid grid-cols- lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {cards.map((c) => <StatCard key={c.title} {...c} />)}
      </div>
    </div>
  );
};

export default OrdersSection;