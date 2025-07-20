import React from 'react';
import { Gem, UserCheck } from 'lucide-react';

interface MissionCompleteScreenProps {
  onAdminConfirm: () => void;
}

const MissionCompleteScreen: React.FC<MissionCompleteScreenProps> = ({ onAdminConfirm }) => {
  return (
    <div>
      <div className="mt-4 flex items-center justify-center">
        <div className="w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
          <Gem className="w-32 h-32 text-blue-600" />
        </div>
      </div>
      <div className="fixed text-center whitespace-nowrap bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
        미션 클리어!
        <br/>
        담당자 확인을 통해
        <br />
        상품 수령을 진행해주세요
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={onAdminConfirm}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-lg font-semibold"
        >
          <UserCheck className="w-6 h-6" />
          <span>담당자 확인</span>
        </button>
      </div>
    </div>
  );
};

export default MissionCompleteScreen;