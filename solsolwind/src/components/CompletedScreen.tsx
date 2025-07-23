import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletedScreenProps {
  onClearAll: () => void;
}

const CompletedScreen: React.FC<CompletedScreenProps> = ({onClearAll}) => {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          상품 수령 완료!
        </h1>
        <p className="text-gray-600 mb-6">
          솔솔이를 찾아라 이벤트에 참여해주셔서 감사합니다.
        </p>
        {/* dev 용 기능 */}
        <div className="p-6 text-center">
          <button 
            onClick={onClearAll} 
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center mx-auto space-x-2"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedScreen;