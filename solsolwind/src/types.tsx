import React from 'react';

export interface CardData {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  expectedUrl: string;
}

export interface QRScannerProps {
  selectedCard: CardData | null;
  isScanning: boolean;
  onClose: () => void;
  onScanResult: (data: string) => void;
  onError: (error: string) => void;
}

export interface CardGridProps {
  cardData: CardData[];
  completionStatus: { [key: number]: boolean };
  onCardClick: (card: CardData) => void;
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
}

export interface FooterProps {
  className?: string;
}

export interface AdminModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApprove: () => void;
}

export interface RewardCompleteModalProps {
  isVisible: boolean;
}