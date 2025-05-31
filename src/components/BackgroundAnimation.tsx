import React, { useEffect, useRef } from 'react';

interface BackgroundAnimationProps {
  selector: string;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ selector }) => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    if (!backgroundRef.current) return;

    // Make sure VANTA is defined
    if (typeof window.VANTA !== 'undefined') {
      vantaEffectRef.current = window.VANTA.NET({
        el: backgroundRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x8B5CF6,
        backgroundColor: 0x111827,
        points: 11.00,
        maxDistance: 21.00,
        spacing: 18.00
      });
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={backgroundRef}
      id={selector}
      className="fixed inset-0 -z-10"
    />
  );
};

// Add global type declaration for VANTA
declare global {
  interface Window {
    VANTA: {
      NET: (opts: any) => any;
    };
  }
}

export default BackgroundAnimation;