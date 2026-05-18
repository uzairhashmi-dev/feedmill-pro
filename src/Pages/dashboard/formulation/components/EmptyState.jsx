import { FlaskConical, Plus } from "lucide-react";

const EmptyState = ({ searching, onAdd }) => (
  <div className="col-span-full py-20 flex flex-col items-center gap-4
                  text-gray-400 dark:text-gray-600
                  bg-gray-50/60 dark:bg-gray-800/30
                  rounded-2xl border-2 border-dashed
                  border-gray-200 dark:border-gray-700">
    <FlaskConical size={52} strokeWidth={1} />
    <div className="text-center">
      <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
        {searching ? "No formulas match your search" : "No formulas yet"}
      </p>
      <p className="text-sm mt-1">
        {searching ? "Try different keywords" : "Create your first feed formula to get started"}
      </p>
    </div>
    {!searching && (
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-emerald-700 text-white
                   px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-800"
      >
        <Plus size={16} /> Create Formula
      </button>
    )}
  </div>
);

export default EmptyState;