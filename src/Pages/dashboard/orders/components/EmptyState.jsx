import { ShoppingBag } from "lucide-react";
const EmptyState = ({ searching }) => (
  <tr><td colSpan="9" className="py-20 text-center">
    <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
      <ShoppingBag size={48} strokeWidth={1} />
      <p className="text-base font-medium">
        {searching ? "No orders match your search" : "No sales orders yet"}
      </p>
      <p className="text-sm">
        {searching ? "Try different keywords" : "Click 'New Order' to create your first sale"}
      </p>
    </div>
  </td></tr>
);
export default EmptyState;