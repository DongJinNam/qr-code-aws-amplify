import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, CheckCircle, AlertCircle, Gem, UserCheck } from 'lucide-react';
import jsQR from "jsqr";
import solsolLive from './assets/solsol_live.gif';
import solsolComplete from './assets/solsol_complete.png';

interface CardData {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  expectedUrl: string;
}

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
      setIsScanning(false);
      handleClose();
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

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 비디오가 준비되지 않았으면 다음 프레임으로 넘어감
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(scanQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const centerSize = Math.min(canvas.width, canvas.height) * 0.5;
    const centerX = canvas.width / 2 - centerSize / 2;
    const centerY = canvas.height / 2 - centerSize / 2;
    const centerImageData = ctx.getImageData(centerX, centerY, centerSize, centerSize);

    const code = jsQR(centerImageData.data, centerSize, centerSize);
    if (code) {
      handleQRCodeResult(code.data);
      setIsScanning(false);
      stopCamera();
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };

    // QR 코드 결과 처리: 이미지 URL이면 이동
  const handleQRCodeResult = (data: string) => {
    if (!selectedCard) return;

    // URL 검증
    if (data !== selectedCard.expectedUrl) {
      setError('올바르지 않은 QR 코드입니다. 해당 보물 장소의 QR 코드를 스캔해주세요.');
      setIsScanning(false);
      stopCamera();
      return;
    }

    // 올바른 URL인 경우 처리
    setScannedData(selectedCard.title);
    setShowResult(true);
    setIsScanning(false);
    stopCamera();

    // 완료 상태 저장
    saveCompletionStatus(selectedCard.id, true);
    setCompletionStatus(prev => ({
      ...prev,
      [selectedCard.id]: true
    }));
  };

  const handleClose = () => {
    setIsScanning(false);
    setSelectedCard(null);
    stopCamera();
  };

  {/* 아래는 테스트할 때만 사용 */}
  // const simulateQRScan = () => {
  //   const mockData = {
  //     1: '보물 장소 1',
  //     2: '보물 장소 2',
  //     3: '보물 장소 3'
  //   };
    
  //   const data = mockData[selectedCard?.id as keyof typeof mockData] || 'QR_CODE_DATA';
  //   setScannedData(data);
  //   setShowResult(true);
  //   setIsScanning(false);
  //   stopCamera();

  //   if (selectedCard) {
  //     saveCompletionStatus(selectedCard.id, true);
  //     setCompletionStatus(prev => ({
  //       ...prev,
  //       [selectedCard.id]: true
  //     }));
  //   }
  // };

  // 완료 상태 저장 함수
  const saveCompletionStatus = (cardId: number, status: boolean) => {
      localStorage.setItem(`completionStatus_${cardId}`, JSON.stringify(status));
  }

  // 완료 상태 가져오기 함수
  const getCompletionStatus = (cardId: number) => {
    const status = localStorage.getItem(`completionStatus_${cardId}`);
    return status ? JSON.parse(status) : false;
  }

  // 상품 수령 상태 저장
  const saveRewardStatus = (status: boolean) => {
    localStorage.setItem(`rewardStatus`, JSON.stringify(status));
  };

  // 상품 수령 상태 가져오기
  const getRewardStatus = () => {
    const status = localStorage.getItem(`rewardStatus`);
    return status ? JSON.parse(status) : false;
  };

  const areAllCardsCompleted = (status: { [key: number]: boolean }) => {
    return Object.values(status).every(value => value === true);
  };

    // 담당자 승인 처리
  const handleAdminApproval = () => {
    setShowAdminModal(false);
    setIsRewardReceived(true);
    saveRewardStatus(true);
    setShowRewardComplete(true);
    
    // 3초 후 페이지 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  // 개발환경 전용 초기화 함수
  const clearAll = () => {
    
    const status: { [key: number]: boolean } = {};
    cardData.forEach(card => {
      status[card.id] = false;      
    });
    setCompletionStatus(status);
    //todo: 상품 수령 확인 이력은 남겨야될듯
    localStorage.clear();

    setShowToastMessage(true);
    setToastMessage('3초 후 초기 화면으로 이동합니다.');

    // 3초 후 페이지 새로고침
    setTimeout(() => {
      setShowToastMessage(false);
      window.location.reload();
    }, 3000);
  };

  //todo: refactor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const first = params.get('first');
    const second = params.get('second');
    const third = params.get('third');
    if (first) {
      localStorage.setItem('completionStatus_1', first);
    }
    if (second) {
      localStorage.setItem('completionStatus_2', second);
    }
    if (third) {
      localStorage.setItem('completionStatus_3', third);
    }  
    const url = new URL(window.location.href);
    url.search = ""; // 파라미터 제거
    window.history.replaceState({}, document.title, url.toString());
  }, []);

  useEffect(() => {
    if (getRewardStatus()) {
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
      status[card.id] = getCompletionStatus(card.id);
    });
    setCompletionStatus(status);
  }, []);


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
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            상품 수령 완료!
          </h1>
          <p className="text-gray-600 mb-6">
            솔솔바람 보물찾기 이벤트에 참여해주셔서 감사합니다.
          </p>
          {/* dev 용 기능 */}
          <div className="p-6 text-center">
            <button onClick={clearAll} className={`bg-orange-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center mx-auto space-x-2`}>
              초기화
            </button>
          </div>          
          {showToastMessage && (
            <div className="fixed text-center whitespace-nowrap bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
              {toastMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          솔솔바람 보물찾기
        </h1>
        {/* 상품 수령 전 */}
        {!showMessage && (
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
                {!completionStatus[card.id] && (
                  <button className={`${card.bgColor} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center mx-auto space-x-2`}>
                    <QrCode className="w-5 h-5" />
                    <span>스캔 시작</span>
                  </button>
                )}
                {completionStatus[card.id] && (
                  <div className="mt-4 flex items-center justify-center">
                    <img className="w-32 h-32" src={solsolComplete} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* 상품 수령 메시지 */}
        {showMessage && (
          <div>
            <div className="mt-4 flex items-center justify-center">
              <img className="w-64 h-64" src={solsolLive} />
            </div>
            <div className="fixed text-center whitespace-nowrap bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
              미션 클리어!
              <br/>
              담당자 확인을 통해
              <br />
              상품 수령을 진행해주세요
            </div>
            
            {/* 담당자 확인 버튼 */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAdminModal(true)}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-lg font-semibold"
              >
                <UserCheck className="w-6 h-6" />
                <span>담당자 확인</span>
              </button>
            </div>
          </div>
        )}

        {showToastMessage && (
          <div className="fixed text-center whitespace-nowrap bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
            {toastMessage}
          </div>
        )}

        {/* 담당자 확인 모달 */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold">담당자 확인</h3>
                <button
                  onClick={() => setShowAdminModal(false)}
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
                    onClick={() => setShowAdminModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAdminApproval}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    승인 완료
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  
                  <div className="whitespace-nowrap absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm text-center">
                    QR 코드를 화면 중앙에 맞춰주세요
                  </div>
                </div>

                {/* 시뮬레이션 필요 시에만 사용 */}                
                {/* <div className="p-4 flex justify-center">
                  <button
                    onClick={simulateQRScan}
                    className={`${selectedCard?.bgColor} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2`}
                  >
                    <Camera className="w-5 h-5" />
                    <span>스캔 시뮬레이션</span>
                  </button>
                </div> */}
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
                <p className="text-sm break-all">{scannedData}</p>
              </div>
            </div>
          </div>
        )}

        {/* 상품 수령 완료 토스트 */}
        {showRewardComplete && (
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