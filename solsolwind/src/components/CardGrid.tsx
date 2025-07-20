import React from 'react';
import { QrCode } from 'lucide-react';
import { type CardGridProps } from '../types';
import solsolComplete from '../assets/solsol_complete.png';

const CardGrid: React.FC<CardGridProps> = ({ cardData, completionStatus, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => onCardClick(card)}
        >
          <div className="p-6 text-center">
            <div className={`${card.color} mb-4 flex justify-center`}>
              {card.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {card.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {card.description}
            </p>
            {!completionStatus[card.id] && (
              <button className={`${card.bgColor} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center mx-auto space-x-2`}>
                <QrCode className="w-5 h-5" />
                <span>스캔 시작</span>
              </button>
            )}
            {completionStatus[card.id] && (
              <div className="mt-4 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                  <img className="w-32 h-32" src={solsolComplete} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;