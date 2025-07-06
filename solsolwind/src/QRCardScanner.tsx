import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, QrCode, Package, User, Building2, CheckCircle, AlertCircle } from 'lucide-react';

interface CardData {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const QRCardScanner: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cardData: CardData[] = [
    {
      id: 1,
      title: '상품 스캔',
      description: '상품 QR 코드를 스캔하여 정보를 확인하세요',
      icon: <Package className="w-10 h-10" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600'
    },
    {
      id: 2,
      title: '고객 정보',
      description: '고객 QR 코드를 스캔하여 프로필을 확인하세요',
      icon: <User className="w-10 h-10" />,
      color: 'text-green-600',
      bgColor: 'bg-green-600'
    },
    {
      id: 3,
      title: '매장 정보',
      description: '매장 QR 코드를 스캔하여 위치를 확인하세요',
      icon: <Building2 className="w-10 h-10" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-600'
    }
  ];

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsScanning(true);
    setError('');
    setScannedData('');
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    setIsScanning(false);
    setSelectedCard(null);
    stopCamera();
  };

  const simulateQRScan = () => {
    const mockData = {
      1: 'PRODUCT_12345_상품명_가격_10000원',
      2: 'CUSTOMER_98765_홍길동_VIP회원',
      3: 'STORE_ABCDE_강남점_서울시_강남구'
    };
    
    const data = mockData[selectedCard?.id as keyof typeof mockData] || 'QR_CODE_DATA';
    setScannedData(data);
    setShowResult(true);
    setIsScanning(false);
    stopCamera();
  };

  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isScanning]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          QR 코드 스캐너
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleCardClick(card)}
            >
              <div className="p-6 text-center">
                <div className={`${card.color} mb-4 flex justify-center`}>
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {card.description}
                </p>
                <button className={`${card.bgColor} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center mx-auto space-x-2`}>
                  <QrCode className="w-5 h-5" />
                  <span>스캔 시작</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* QR 스캔 모달 */}
        {isScanning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className={`${selectedCard?.bgColor} text-white p-4 rounded-t-lg flex justify-between items-center`}>
                <h3 className="text-lg font-semibold">
                  {selectedCard?.title} - QR 스캔
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="relative">
                <div className="relative w-full h-96 bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  
                  {/* QR 스캔 오버레이 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm text-center">
                    QR 코드를 화면 중앙에 맞춰주세요
                  </div>
                </div>
                
                <div className="p-4 flex justify-center">
                  <button
                    onClick={simulateQRScan}
                    className={`${selectedCard?.bgColor} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2`}
                  >
                    <Camera className="w-5 h-5" />
                    <span>스캔 시뮬레이션</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 스캔 결과 토스트 */}
        {showResult && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">스캔 완료!</p>
                <p className="text-sm break-all">데이터: {scannedData}</p>
              </div>
            </div>
          </div>
        )}

        {/* 에러 토스트 */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCardScanner;