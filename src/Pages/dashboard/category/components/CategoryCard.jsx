import { FolderTree, Edit3, Trash2 } from "lucide-react";
import { CARD_GRADIENTS } from "../constants";

const CategoryCard = ({ cat, index, onEdit, onDelete }) => {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  return (
    <div className="bg-white dark:bg-gray-900
                    border border-gray-100 dark:border-gray-800
                    rounded-2xl shadow-sm hover:shadow-md
                    transition-all group overflow-hidden">
      {/* top accent bar */}
      <div className={`bg-linear-to-r ${gradient} h-1.5`} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className={`bg-linear-to-br ${gradient} p-2.5 rounded-xl text-white`}>
            <FolderTree size={18} />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(cat)}
              className="p-1.5 text-gray-400 hover:text-blue-600
                         hover:bg-blue-50 dark:hover:bg-blue-900/30
                         rounded-lg transition-all" title="Edit">
              <Edit3 size={15} />
            </button>
            <button onClick={() => onDelete(cat)}
              className="p-1.5 text-gray-400 hover:text-red-600
                         hover:bg-red-50 dark:hover:bg-red-900/30
                         rounded-lg transition-all" title="Delete">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 dark:text-white text-base leading-tight">
          {cat.categoryName}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 line-clamp-2 min-h-10">
          {cat.description || <span className="italic text-gray-300 dark:text-gray-600">No description</span>}
        </p>

        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800
                        flex justify-between items-center text-[11px]
                        text-gray-400 dark:text-gray-600">
          <span>Created {new Date(cat.createdAt).toLocaleDateString()}</span>
          <span>Updated {new Date(cat.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
export default CategoryCard;