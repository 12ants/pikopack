import { useGameStore } from '../store';
import { useState } from 'react';

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useGameStore(s => s.settings);
  const updateSetting = useGameStore(s => s.updateSetting);
  const vehicleType = useGameStore(s => s.vehicleType);
  const setVehicleType = useGameStore(s => s.setVehicleType);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-6 right-6 z-20 bg-black text-white px-4 py-2 border border-white/30 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest"
      >
        [ Config ]
      </button>
    );
  }

  return (
    <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm flex items-center justify-center font-mono">
      <div className="w-full max-w-md p-8 border border-white/20 bg-black text-white">
        <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
          <h2 className="text-xl font-bold tracking-widest uppercase">Configuration</h2>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-6">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Vehicle Type</span>
            <select 
              value={vehicleType} 
              onChange={e => setVehicleType(e.target.value as 'car' | 'van' | 'truck')}
              className="bg-black border border-white/50 rounded-none px-2 py-1 text-white outline-none focus:border-white transition-colors text-xs uppercase"
            >
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Shadows</span>
            <input type="checkbox" checked={settings.shadows} onChange={e => updateSetting('shadows', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Post-Processing</span>
            <input type="checkbox" checked={settings.postProcessing} onChange={e => updateSetting('postProcessing', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Dynamic Env</span>
            <input type="checkbox" checked={settings.destructibles} onChange={e => updateSetting('destructibles', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Time Cycle</span>
            <select 
              value={settings.timeOfDay} 
              onChange={e => updateSetting('timeOfDay', e.target.value)}
              className="bg-black border border-white/50 rounded-none px-2 py-1 text-white outline-none focus:border-white transition-colors text-xs uppercase"
            >
              <option value="twilight">Twilight</option>
              <option value="dusk">Dusk</option>
            </select>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Physics Debug</span>
            <input type="checkbox" checked={settings.debugPhysics} onChange={e => updateSetting('debugPhysics', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Dev Info</span>
            <input type="checkbox" checked={settings.devInfo} onChange={e => updateSetting('devInfo', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>

          <div className="border-t border-white/20 pt-4 mt-4">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Map Layers</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Traffic</span>
                <input type="checkbox" checked={settings.traffic} onChange={e => updateSetting('traffic', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Weather</span>
                <input type="checkbox" checked={settings.weather} onChange={e => updateSetting('weather', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-white/70 group-hover:text-white transition-colors uppercase text-xs tracking-wider">Satellite View</span>
                <input type="checkbox" checked={settings.satelliteView} onChange={e => updateSetting('satelliteView', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
