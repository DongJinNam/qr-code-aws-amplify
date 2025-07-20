import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { type ToastProps } from '../types';

const Toast: React.FC<ToastProps> = ({ message, type, isVisible }) => {
  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? 
    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : 
    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50 max-w-sm`}>
      <div className="flex items-start space-x-2">
        {icon}
        <div>
          <p className="text-sm break-all">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;