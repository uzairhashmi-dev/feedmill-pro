import { AlertCircle, Loader2 } from "lucide-react";

const DeleteModal = ({ cat, onConfirm, onClose, deleting }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-900
                    border border-transparent dark:border-gray-800
                    rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
      <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Delete Category</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-300">"{cat?.categoryName}"</span>?
        This may affect formulas using this category.
      </p>
      <div className="flex gap-3 mt-6">
        <button onClick={onClose}
          className="flex-1 border border-gray-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-300 py-2.5 rounded-xl
                     font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 bg-red-500 text-white py-2.5 rounded-xl
                     font-medium hover:bg-red-600 flex items-center
                     justify-center gap-2 disabled:opacity-60">
          {deleting && <Loader2 size={16} className="animate-spin" />} Delete
        </button>
      </div>
    </div>
  </div>
);
export default DeleteModal;