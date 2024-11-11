import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, size = 256 }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <QRCode 
        value={url}
        size={size}
        level="H"
        includeMargin
        renderAs="canvas"
      />
      <p className="text-sm text-gray-600">
        Scan this QR code to visit the mobile coffee shop
      </p>
    </div>
  );
};