import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { type QRScannerProps } from '../types';
import jsQR from 'jsqr';

const QRScanner: React.FC<QRScannerProps> = ({
  selectedCard,
  isScanning,
  onClose,
  onScanResult,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      onError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
      onClose();
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
    console.log(code);
    if (!code) {
      onScanResult(code.data);
      // handleQRCodeResult(code.data);
      // setIsScanning(false);
      stopCamera();
    } else {
      requestAnimationFrame(scanQRCode);
    }


    // Mock QR detection for demo (replace with actual jsQR)
    const mockDetection = Math.random() < 0.1; // 10% chance per frame
    if (mockDetection && selectedCard) {
      onScanResult(selectedCard.expectedUrl);
      stopCamera();
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };

  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isScanning]);

  if (!isScanning || !selectedCard) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className={`${selectedCard.bgColor} text-white p-4 rounded-t-lg flex justify-between items-center`}>
          <h3 className="text-lg font-semibold">
            {selectedCard.title} - QR 스캔
          </h3>
          <button
            onClick={onClose}
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
        </div>
      </div>
    </div>
  );
};

export default QRScanner;