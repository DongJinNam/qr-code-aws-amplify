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
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">문의사항</h3>
            <p className="text-gray-300 text-sm">
              이벤트 관련 문의사항이 있으시면<br />
              02-2258-5306 으로 연락주세요.
            </p>
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