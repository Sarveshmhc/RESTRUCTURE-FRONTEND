import React from "react";
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) =>
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px]">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        {children}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
export default Modal;