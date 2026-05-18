import { FolderTree } from "lucide-react";

const EmptyState = ({ searching }) => (
  <div className="col-span-full py-20 flex flex-col items-center gap-3
                  text-gray-400 dark:text-gray-600">
    <FolderTree size={52} strokeWidth={1} />
    <p className="text-base font-medium">
      {searching ? "No categories match your search" : "No categories yet"}
    </p>
    <p className="text-sm">
      {searching ? "Try different keywords or clear the search" : "Click 'Add Category' to create one"}
    </p>
  </div>
);
export default EmptyState;