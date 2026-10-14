import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Waves, CloudRain, Wind, Sparkles } from 'lucide-react';

export default function SoundscapePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState('ocean'); // 'ocean', 'rain', 'brown'
  const [volume, setVolume] = useState(0.3);
  const [isOpen, setIsOpen] = useState(false);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const timerRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startSound = () => {
    initAudio();
    stopSound();

    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 4; // 4 seconds of noise buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate warm brown/pink noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration filter
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter node
    const filter = ctx.createBiquadFilter();
    if (soundType === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
    } else if (soundType === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
    } else {
      // Ocean waves: lower cutoff, will be modulated
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();

    sourceNodeRef.current = noise;
    filterNodeRef.current = filter;
    gainNodeRef.current = gain;

    // Ocean waves rhythmic oscillation
    if (soundType === 'ocean') {
      let phase = 0;
      timerRef.current = setInterval(() => {
        if (!filterNodeRef.current || !gainNodeRef.current) return;
        phase += 0.06;
        // Natural ebb and flow
        const freq = 400 + Math.sin(phase) * 280;
        const vol = volume * (0.6 + Math.sin(phase) * 0.35);
        filterNodeRef.current.frequency.setTargetAtTime(Math.max(120, freq), ctx.currentTime, 0.1);
        gainNodeRef.current.gain.setTargetAtTime(Math.max(0.01, vol), ctx.currentTime, 0.1);
      }, 100);
    }

    setIsPlaying(true);
  };

  const stopSound = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      startSound();
    }
    return () => stopSound();
  }, [soundType]);

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all border shadow-2xs ${
          isPlaying
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20'
            : 'bg-stone-50 text-stone-600 border-stone-200/80 hover:bg-stone-100 hover:text-stone-900'
        }`}
        title="Calming Ambient Soundscapes"
      >
        {isPlaying ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline capitalize font-medium">{soundType}</span>
          </>
        ) : (
          <>
            <Wind className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Calm Sounds</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/80 z-50 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Ambient Soundscapes
            </span>
            <span className="text-[10px] text-stone-400">Offline Synthesis</span>
          </div>

          {/* Sound options */}
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: 'ocean', label: 'Ocean', icon: Waves },
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'brown', label: 'Brown', icon: Wind },
            ].map((s) => {
              const Icon = s.icon;
              const isSel = soundType === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSoundType(s.id);
                    if (!isPlaying) startSound();
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                    isSel
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Play / Stop Button */}
          <button
            onClick={() => {
              if (isPlaying) stopSound();
              else startSound();
            }}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              isPlaying
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Mute Soundscape' : 'Play Soundscape'}</span>
          </button>

          {/* Volume slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
