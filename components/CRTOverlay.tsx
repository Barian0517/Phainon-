import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full select-none">
      

      {/* 2. Moving Scanlines: Horizontal lines that slowly scroll down */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] animate-scanline pointer-events-none"></div>

      {/* 3. Rolling Scan Bar: A faint bright band moving down (refresh rate) */}
      <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-white to-transparent opacity-[0.03] animate-scan-bar pointer-events-none"></div>

      {/* 4. Vignette: Deep, strong curvature effect. Darker corners, lighter center. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.8)_85%,rgba(0,0,0,1)_100%)] pointer-events-none"></div>
      
    </div>
  );
};