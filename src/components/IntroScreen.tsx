import { useGameStore } from '../store';

export function IntroScreen() {
  const startGame = useGameStore(s => s.startGame);
  const settings = useGameStore(s => s.settings);
  const updateSetting = useGameStore(s => s.updateSetting);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white font-mono selection:bg-white selection:text-black">
      <div className="max-w-2xl w-full p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter uppercase">Terminal Delivery</h1>
        <p className="text-white/50 mb-12 tracking-widest text-sm uppercase">v1.0.0 // Ready for deployment</p>
        
        <div className="space-y-6 mb-12 border-l-2 border-white/20 pl-6">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-sm tracking-wider">Shadow Rendering</span>
            <input type="checkbox" checked={settings.shadows} onChange={e => updateSetting('shadows', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-sm tracking-wider">Post-Processing</span>
            <input type="checkbox" checked={settings.postProcessing} onChange={e => updateSetting('postProcessing', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-sm tracking-wider">Dynamic Environment</span>
            <input type="checkbox" checked={settings.destructibles} onChange={e => updateSetting('destructibles', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-sm tracking-wider">Time Cycle</span>
            <select 
              value={settings.timeOfDay} 
              onChange={e => updateSetting('timeOfDay', e.target.value)}
              className="bg-black border border-white/50 rounded-none px-2 py-1 text-white outline-none focus:border-white transition-colors text-sm uppercase"
            >
              <option value="twilight">Twilight</option>
              <option value="dusk">Dusk</option>
            </select>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white/70 group-hover:text-white transition-colors uppercase text-sm tracking-wider">Developer Info</span>
            <input type="checkbox" checked={settings.devInfo} onChange={e => updateSetting('devInfo', e.target.checked)} className="w-4 h-4 appearance-none border border-white/50 checked:bg-white checked:border-white transition-colors" />
          </label>
        </div>

        <button 
          onClick={startGame}
          className="w-full py-4 bg-white text-black text-xl font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest"
        >
          [ Initialize Sequence ]
        </button>
      </div>
    </div>
  );
}
