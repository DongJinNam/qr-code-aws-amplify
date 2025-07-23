import React from 'react';
import { Gem } from 'lucide-react';
import { type CardData } from '../types';

export const cardData: CardData[] = [
  {
    id: 1,
    title: '솔솔이 1',
    description: 'QR 코드를 스캔하여 솔솔이를 확인하세요',
    icon: React.createElement(Gem, { className: "w-10 h-10" }),
    color: 'text-blue-600',
    bgColor: 'bg-blue-600',
    expectedUrl: 'https://m.site.naver.com/1MuFR'
  },
  {
    id: 2,
    title: '솔솔이 2',
    description: 'QR 코드를 스캔하여 솔솔이을 확인하세요',
    icon: React.createElement(Gem, { className: "w-10 h-10" }),
    color: 'text-green-600',
    bgColor: 'bg-green-600',
    expectedUrl: 'https://m.site.naver.com/1MuG7'
  },
  {
    id: 3,
    title: '솔솔이 3',
    description: 'QR 코드를 스캔하여 솔솔이을 확인하세요',
    icon: React.createElement(Gem, { className: "w-10 h-10" }),
    color: 'text-red-600',
    bgColor: 'bg-red-600',
    expectedUrl: 'https://m.site.naver.com/1MuGe'
  }
];