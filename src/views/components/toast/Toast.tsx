import React from "react";
type ToastProps = { message: string; type?: "success" | "error" | "info" };
const Toast: React.FC<ToastProps> = ({ message, type = "info" }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg ${
      type === "success"
        ? "bg-green-600 text-white"
        : type === "error"
        ? "bg-red-600 text-white"
        : "bg-gray-800 text-white"
    }`}
  >
    {message}
  </div>
);
export default Toast;