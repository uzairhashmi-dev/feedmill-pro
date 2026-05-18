import { Package } from "lucide-react";
const EmptyState = ({ searching }) => (
  <tr>
    <td colSpan="7" className="py-16 text-center">
      <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
        <Package size={48} strokeWidth={1} />
        <p className="text-base font-medium">
          {searching ? "No items match your search" : "No inventory items yet"}
        </p>
        <p className="text-sm">
          {searching ? "Try different keywords or clear filters" : "Click 'Add Item' to get started"}
        </p>
      </div>
    </td>
  </tr>
);
export default EmptyState;