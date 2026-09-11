import React from 'react';

interface TrussLogoProps {
  size?: number;
  className?: string;
}

export const TrussLogo: React.FC<TrussLogoProps> = ({ size = 36, className }) => {
  return (
    <img
      src="/logo.png"
      alt="TrussStack"
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'block',
        borderRadius: '4px',
      }}
    />
  );
};
