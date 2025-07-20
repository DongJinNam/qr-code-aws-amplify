import React, { useState, useEffect } from 'react';
import { Gem } from 'lucide-react';
import Footer from './components/Footer';
import CardGrid from './components/CardGrid';
import QRScanner from './components/QRScanner';
import Toast from './components/Toast';
import type { CardData } from './types';
import { StorageUtils } from './utils/StorageUtils';
import RewardCompleteModal from './components/RewardCompleteModal';
import AdminModal from './components/AdminModal';
import MissionCompleteScreen from './components/MissionCompleteScreen';
import CompletedScreen from './components/CompletedScreen';

// Main Component
const QRCardScanner: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isRewardReceived, setIsRewardReceived] = useState(false);
  const [showRewardComplete, setShowRewardComplete] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<{ [key: number]: boolean }>({});
  const [showMessage, setShowMessage] = useState(false);
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const cardData: CardData[] = [
    {
      id: 1,
      title: '보물 장소 1',
      description: 'QR 코드를 스캔하여 보물을 확인하세요',
      icon: <Gem className="w-10 h-10" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600',
      expectedUrl: 'https://m.site.naver.com/1MuFR'
    },
    {
      id: 2,
      title: '보물 장소 2',
      description: 'QR 코드를 스캔하여 보물을 확인하세요',
      icon: <Gem className="w-10 h-10" />,
      color: 'text-green-600',
      bgColor: 'bg-green-600',
      expectedUrl: 'https://m.site.naver.com/1MuG7'
    },
    {
      id: 3,
      title: '보물 장소 3',
      description: 'QR 코드를 스캔하여 보물을 확인하세요',
      icon: <Gem className="w-10 h-10" />,
      color: 'text-red-600',
      bgColor: 'bg-red-600',
      expectedUrl: 'https://m.site.naver.com/1MuGe'
    }
  ];

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsScanning(true);
    setError('');
    setScannedData('');
  };

  const handleQRCodeResult = (data: string) => {
    if (!selectedCard) return;

    if (data !== selectedCard.expectedUrl) {
      setError('올바르지 않은 QR 코드입니다. 해당 보물 장소의 QR 코드를 스캔해주세요.');
      setIsScanning(false);
      return;
    }

    setScannedData(selectedCard.title);
    setShowResult(true);
    setIsScanning(false);

    StorageUtils.saveCompletionStatus(selectedCard.id, true);
    setCompletionStatus(prev => ({
      ...prev,
      [selectedCard.id]: true
    }));
  };

  const handleClose = () => {
    setIsScanning(false);
    setSelectedCard(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const areAllCardsCompleted = (status: { [key: number]: boolean }) => {
    return Object.values(status).every(value => value === true);
  };

  const handleAdminApproval = () => {
    setShowAdminModal(false);
    setIsRewardReceived(true);
    StorageUtils.saveRewardStatus(true);
    setShowRewardComplete(true);
    
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const clearAll = () => {
    const status: { [key: number]: boolean } = {};
    cardData.forEach(card => {
      status[card.id] = false;      
    });
    setCompletionStatus(status);
    StorageUtils.clearAll();

    setShowToastMessage(true);
    setToastMessage('3초 후 초기 화면으로 이동합니다.');

    setTimeout(() => {
      setShowToastMessage(false);
      window.location.reload();
    }, 3000);
  };

  // Effects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const first = params.get('first');
    const second = params.get('second');
    const third = params.get('third');
    if (first) {
      StorageUtils.saveCompletionStatus(1, JSON.parse(first));
    }
    if (second) {
      StorageUtils.saveCompletionStatus(2, JSON.parse(second));
    }
    if (third) {
      StorageUtils.saveCompletionStatus(3, JSON.parse(third));
    }
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }, []);

  useEffect(() => {
    if (StorageUtils.getRewardStatus()) {
      setIsRewardReceived(true);
      setShowMessage(false);
    } else if (areAllCardsCompleted(completionStatus) && Object.keys(completionStatus).length === cardData.length) {
      setShowMessage(true);
    } else {
      setShowMessage(false);
    }
  }, [completionStatus, cardData.length]);

  useEffect(() => {
    const status: { [key: number]: boolean } = {};
    cardData.forEach(card => {
      status[card.id] = StorageUtils.getCompletionStatus(card.id);
    });
    setCompletionStatus(status);
  }, []);

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setShowResult(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (showRewardComplete) {
      const timer = setTimeout(() => {
        setShowRewardComplete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showRewardComplete]);

  // 상품 수령 완료된 경우 화면
  if (isRewardReceived) {
    return (
      <div>
        <CompletedScreen onClearAll={clearAll} showToastMessage={false} toastMessage={''} />
        <Toast message={showToastMessage ? `${toastMessage}` : error}
               type={showToastMessage ? 'success' : 'error'}
               isVisible={showToastMessage || !!error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            솔솔바람 보물찾기
          </h1>
          
          {/* 상품 수령 전 */}
          {!showMessage && (
            <CardGrid 
              cardData={cardData}
              completionStatus={completionStatus}
              onCardClick={handleCardClick}
            />
          )}

          {showMessage && <MissionCompleteScreen         
            onAdminConfirm={() => setShowAdminModal(true)} />}

          <Toast
            message={showToastMessage ? `${toastMessage}` : error}
            type={showToastMessage ? 'success' : 'error'}
            isVisible={showToastMessage || !!error}
          />

          <AdminModal isVisible={showAdminModal}
            onClose={() => setShowAdminModal(false)}
            onApprove={handleAdminApproval} />

          <QRScanner
            selectedCard={selectedCard}
            isScanning={isScanning}
            onClose={handleClose}
            onScanResult={handleQRCodeResult}
            onError={handleError}
          />

          <Toast
            message={showResult ? `스캔 완료! ${scannedData}` : error}
            type={showResult ? 'success' : 'error'}
            isVisible={showResult || !!error}
          />

          <RewardCompleteModal
            isVisible={showRewardComplete} />
        </div>
      </div>
      
      {/* Footer는 상품 수령 완료 전에만 표시 */}
      {!showMessage && <Footer />}      
    </div>
  );
};

export default QRCardScanner;
