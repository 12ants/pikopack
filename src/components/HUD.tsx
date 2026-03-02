import { useGameStore, LOCATIONS, globalCarPosition } from '../store';
import { useState, useEffect, useRef } from 'react';

export function HUD() {
  const { score, hasPackage, targetLocation } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-6 pointer-events-none z-10 flex justify-between items-start font-mono text-white uppercase tracking-widest">
      <div className="flex flex-col gap-2">
        <div className="bg-black/80 border border-white/30 px-4 py-2 backdrop-blur-sm">
          <span className="text-white/50 text-xs mr-2">STATUS</span>
          <span className={hasPackage ? "text-white" : "text-white/80"}>
            {hasPackage ? "DELIVERING" : "AWAITING PICKUP"}
          </span>
        </div>
        <div className="bg-black/80 border border-white/30 px-4 py-2 backdrop-blur-sm">
          <span className="text-white/50 text-xs mr-2">DELIVERIES</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
      </div>

      <Minimap targetLocation={targetLocation} hasPackage={hasPackage} />
    </div>
  );
}

function Minimap({ targetLocation, hasPackage }: { targetLocation: [number, number, number], hasPackage: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const size = 160;
    const scale = size / 400; // Map is roughly 400x400

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.strokeRect(0, 0, size, size);

      // Center of map is (0,0) in world, (size/2, size/2) in canvas
      const worldToCanvas = (x: number, z: number) => ({
        x: (x * scale) + (size / 2),
        y: (z * scale) + (size / 2)
      });

      // Draw all locations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      LOCATIONS.forEach(loc => {
        const { x, y } = worldToCanvas(loc[0], loc[2]);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw active target
      const target = worldToCanvas(targetLocation[0], targetLocation[2]);
      ctx.fillStyle = hasPackage ? '#00ff00' : '#0088ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw car
      const car = worldToCanvas(globalCarPosition.x, globalCarPosition.z);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(car.x, car.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [targetLocation, hasPackage]);

  return (
    <div className="bg-black/80 border border-white/30 p-2 backdrop-blur-sm">
      <div className="text-[10px] text-white/50 mb-1 text-right">NAV.SYSTEM</div>
      <canvas ref={canvasRef} width={160} height={160} className="w-40 h-40" />
      <div className="text-[8px] text-white/30 mt-1 uppercase tracking-tighter">Service Area // Active</div>
    </div>
  );
}
