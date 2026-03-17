import { useGameStore } from '../store';

export function HUD() {
  const { score, hasPackage, playerState } = useGameStore();

  // Only show score and delivery status when in vehicle
  const inVehicle = playerState === 'driving';
  
  return (
    <>
      {inVehicle && (
        <div className="absolute top-4 right-4 pointer-events-none z-10 font-mono text-white uppercase tracking-widest">
          <div className="bg-black/80 border border-white/30 px-3 py-1 backdrop-blur-sm text-xs">
            <span className="text-white/50 mr-2">DELIVERIES</span>
            <span className="font-bold">{score}</span>
          </div>
          <div className="bg-black/80 border border-white/30 px-3 py-1 backdrop-blur-sm text-xs mt-1">
            <span className={hasPackage ? "text-green-400" : "text-white/50"}>
              {hasPackage ? "DELIVERING" : "AWAITING"}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// Minimap removed for performance
