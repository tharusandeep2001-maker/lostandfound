import React, { useEffect, useRef } from 'react';

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  confirmClassName = 'bg-blue-600 hover:bg-blue-700 text-white', 
  onConfirm, 
  onCancel, 
  isLoading = false,
  confirmTestId
}) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white text-left rounded-2xl shadow-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-title" className="font-bold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{message}</p>
        
        <div className="mt-6 flex gap-3 justify-end">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            data-testid={confirmTestId}
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${confirmClassName}`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
