import React from 'react';
import { type FooterProps } from '../types';

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-gray-800 text-white py-8 mt-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">이벤트 안내</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• 병동에 숨겨진 QR 코드를 스캔하여 미션을 완료하세요.</li>
              <li>• 솔솔바람 프로그램실을 방문하면 상품을 받을 수 있습니다.</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 솔솔바람. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;