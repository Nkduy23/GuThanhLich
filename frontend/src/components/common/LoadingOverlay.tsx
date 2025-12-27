import React from "react";

const LoadingOverlay: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center space-y-4 p-6 rounded-lg shadow-xl bg-white/80">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-700 font-medium text-sm">Đang tải...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
