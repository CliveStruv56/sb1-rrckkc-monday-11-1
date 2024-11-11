import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 500 500"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="250" cy="250" r="240" stroke="currentColor" strokeWidth="20" fill="none"/>
      <text
        x="250"
        y="180"
        textAnchor="middle"
        style={{
          fontSize: '80px',
          fontFamily: 'serif',
          fontWeight: 'bold'
        }}
      >
        SOME
      </text>
      <text
        x="250"
        y="280"
        textAnchor="middle"
        style={{
          fontSize: '80px',
          fontFamily: 'serif',
          fontWeight: 'bold'
        }}
      >
        GOOD
      </text>
      <text
        x="250"
        y="380"
        textAnchor="middle"
        style={{
          fontSize: '80px',
          fontFamily: 'cursive',
          fontStyle: 'italic'
        }}
      >
        cuppa
      </text>
    </svg>
  );
};