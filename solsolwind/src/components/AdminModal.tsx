import React from 'react';
import { X, UserCheck } from 'lucide-react';
import { type AdminModalProps } from '../types';

const AdminModal: React.FC<AdminModalProps> = ({ isVisible, onClose, onApprove }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">담당자 확인</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <UserCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              상품 수령 확인
            </h4>
            <p className="text-gray-600 whitespace-nowrap">
              담당자가 상품을 전달했는지 확인해주세요.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onApprove}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              승인 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;