import React, { useState, useEffect } from 'react';

let toastFn = null;

export function showToast(msg, type = 'success') {
  toastFn?.(msg, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  
  toastFn = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2 transform transition-all duration-300 ease-out translate-y-0 opacity-100 ${
            t.type === 'alert' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {t.type === 'alert' ? '■' : '■'} {t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
