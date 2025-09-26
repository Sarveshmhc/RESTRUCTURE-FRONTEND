import React from "react";
const Loader: React.FC<{ loading?: boolean }> = ({ loading }) =>
  loading ? (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
    </div>
  ) : null;
export default Loader;