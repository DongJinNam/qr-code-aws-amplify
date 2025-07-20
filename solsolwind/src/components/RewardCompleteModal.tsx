import React from 'react';
import { CheckCircle } from 'lucide-react';
import { type RewardCompleteModalProps } from '../types';

const RewardCompleteModal: React.FC<RewardCompleteModalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          상품 수령이 완료되었습니다!
        </h3>
        <p className="text-gray-600">
          잠시 후 페이지가 새로고침됩니다.
        </p>
      </div>
    </div>
  );
};

export default RewardCompleteModal;