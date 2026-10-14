import React, { useState, useEffect } from 'react';
import {
  Wind,
  Eye,
  Hand,
  Volume2,
  Smile,
  Coffee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sun,
  ShieldCheck,
  Pause,
  Play,
  Heart
} from 'lucide-react';
import { api } from '../services/api';

export default function CopingToolkit({ initialSection = "54321" }) {
const [activeTab, setActiveTab] = useState(initialSection);// 54321, box, pmr, safeplace, calm

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2d3748]">
          Somatic Coping Toolkit
        </h1>
        <p className="text-xs text-[#718096] leading-relaxed">
          Evidence-informed grounding techniques designed to stimulate the parasympathetic nervous system and soothe acute alarm.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
        {[
          { id: '54321', label: '5-4-3-2-1 Grounding', icon: Eye },
          { id: 'box', label: 'Box Breathing (4x4)', icon: Wind },
          { id: 'pmr', label: 'Muscle Relaxation', icon: Sparkles },
          { id: 'safeplace', label: 'Safe Place Guide', icon: Sun },
          { id: 'calm', label: 'Calm Sanctuary', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all shadow-2xs ${
                isActive
                  ? 'bg-[#3d695d] text-white shadow-xs'
                  : 'bg-white text-[#64748b] hover:bg-[#f7f5f0] border border-[#ece8df]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Views */}
      <div className="mt-4">
        {activeTab === '54321' && <SensoryGroundingView />}
        {activeTab === 'box' && <BoxBreathingView />}
        {activeTab === 'pmr' && <MuscleRelaxationView />}
        {activeTab === 'safeplace' && <SafePlaceView />}
        {activeTab === 'calm' && <CalmModeView />}
      </div>

    </div>
  );
}

// 1. 5-4-3-2-1 Sensory Grounding Module
function SensoryGroundingView() {
  const steps = [
    { count: 5, sense: 'SEE', icon: Eye, instruction: 'Notice 5 things you can visually see around you right now.', hint: 'A picture on the wall, wood grain, a light switch, reflection, pencil.' },
    { count: 4, sense: 'FEEL', icon: Hand, instruction: 'Notice 4 physical textures you can touch or feel.', hint: 'Soles of your shoes, cotton shirt, smooth phone, coolness of the air.' },
    { count: 3, sense: 'HEAR', icon: Volume2, instruction: 'Notice 3 subtle sounds in your environment.', hint: 'Distant traffic, hum of a fan, birds outside, your gentle breath.' },
    { count: 2, sense: 'SMELL', icon: Coffee, instruction: 'Notice 2 things you can smell right now.', hint: 'Fresh air, coffee, clean soap, clothing fabric.' },
    { count: 1, sense: 'TASTE', icon: Smile, instruction: 'Notice 1 taste in your mouth right now.', hint: 'A sip of cool water, mint, or simply the neutral resting taste.' },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [itemsLogged, setItemsLogged] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const currentStep = steps[currentStepIndex];

  const handleAddItem = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newLogged = [...itemsLogged, inputValue.trim()];
    setItemsLogged(newLogged);
    setInputValue('');

    if (newLogged.length >= currentStep.count) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setItemsLogged([]);
      } else {
        setCompleted(true);
        api.recordGrounding('5-4-3-2-1', 180).catch(console.error);
      }
    }
  };

  const resetExercise = () => {
    setCurrentStepIndex(0);
    setCompleted(false);
    setItemsLogged([]);
    setInputValue('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#ece8df] shadow-xs max-w-xl mx-auto">
      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-[#eaf1ed] text-[#2d564b] rounded-full text-xs font-semibold font-mono">
              Step {currentStepIndex + 1} of 5
            </span>
            <span className="text-xs text-[#a0aec0]">
              {currentStep.count - itemsLogged.length} more to find
            </span>
          </div>

          <div className="text-center space-y-3 py-2">
            <div className="w-14 h-14 rounded-2xl bg-[#eaf1ed] text-[#3d695d] mx-auto flex items-center justify-center shadow-2xs">
              {React.createElement(currentStep.icon, { className: "w-7 h-7" })}
            </div>
            <h2 className="text-xl font-bold text-[#2d3748]">
              {currentStep.count} Things You Can {currentStep.sense}
            </h2>
            <p className="text-xs sm:text-sm text-[#4a5568] max-w-md mx-auto leading-relaxed">
              {currentStep.instruction}
            </p>
            <p className="text-[11px] text-[#a0aec0] italic">
              Ideas: {currentStep.hint}
            </p>
          </div>

          {/* Items Logged */}
          {itemsLogged.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {itemsLogged.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#eaf1ed] text-[#2d564b] rounded-xl text-xs font-medium flex items-center gap-1.5 animate-in zoom-in-95">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3d695d]" />
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Notice item #${itemsLogged.length + 1}...`}
              className="flex-1 px-4 py-3 bg-[#fbfaf8] rounded-2xl border border-[#ded8cc] focus:outline-hidden focus:border-[#3d695d] text-sm text-[#2d3748]"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-5 py-3 rounded-2xl bg-[#3d695d] hover:bg-[#34594f] text-white text-xs font-semibold disabled:opacity-40 shadow-2xs transition-colors"
            >
              Add ({itemsLogged.length + 1}/{currentStep.count})
            </button>
          </form>

          <div className="flex justify-between items-center pt-3 border-t border-[#f4f1ea] text-xs">
            <button
              onClick={() => {
                const dummy = `Noticed item #${itemsLogged.length + 1}`;
                const newLogged = [...itemsLogged, dummy];
                setItemsLogged(newLogged);
                if (newLogged.length >= currentStep.count) {
                  if (currentStepIndex < steps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                    setItemsLogged([]);
                  } else {
                    setCompleted(true);
                    api.recordGrounding('5-4-3-2-1', 180).catch(console.error);
                  }
                }
              }}
              className="text-[#718096] hover:text-[#2d3748] underline text-[11px]"
            >
              Quick check (I noticed one)
            </button>
            <button
              onClick={resetExercise}
              className="text-[#718096] hover:text-[#2d3748] flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-[#eaf1ed] text-[#3d695d] rounded-2xl mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#2d3748]">Grounding Complete</h2>
          <p className="text-xs text-[#718096] max-w-sm mx-auto leading-relaxed">
            You engaged all five senses and reconnected with your physical surroundings. Your session has been recorded.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={resetExercise}
              className="px-5 py-2.5 rounded-2xl bg-[#3d695d] hover:bg-[#34594f] text-white text-xs font-semibold shadow-2xs"
            >
              Practice Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Box Breathing View
function BoxBreathingView() {
  const [phase, setPhase] = useState('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isRunning, setIsRunning] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          if (phase === 'Inhale') {
            setPhase('Hold Breath');
            return 4;
          } else if (phase === 'Hold Breath') {
            setPhase('Exhale Slowly');
            return 4;
          } else if (phase === 'Exhale Slowly') {
            setPhase('Rest Empty');
            return 4;
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => {
              const nextCount = c + 1;
              if (nextCount % 4 === 0) {
                api.recordGrounding('box_breathing', 64).catch(console.error);
              }
              return nextCount;
            });
            return 4;
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isRunning]);

  const isExpanding = phase === 'Inhale';
  const isHoldingFull = phase === 'Hold Breath';

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#ece8df] shadow-xs max-w-lg mx-auto text-center space-y-8">
      <div>
        <span className="px-3 py-1 bg-[#eaf1ed] text-[#2d564b] rounded-full text-xs font-semibold font-mono">
          Autonomic Nervous System Regulation
        </span>
        <h2 className="text-xl font-bold text-[#2d3748] mt-2">Box Breathing (4-4-4-4)</h2>
        <p className="text-xs text-[#718096] mt-0.5">
          Inhale 4s • Hold 4s • Exhale 4s • Hold 4s
        </p>
      </div>

      {/* Gentle Breathing Bubble */}
      <div className="relative py-10 flex items-center justify-center">
        <div
          className={`absolute rounded-full transition-all duration-1000 ${
            isExpanding || isHoldingFull
              ? 'w-64 h-64 bg-[#eaf1ed]/70'
              : 'w-44 h-44 bg-[#f4f8f6]/50'
          }`}
        />

        <div
          className={`relative z-10 rounded-full flex flex-col items-center justify-center text-white shadow-md transition-all duration-1000 ${
            isExpanding || isHoldingFull
              ? 'w-52 h-52 bg-gradient-to-tr from-[#3d695d] to-[#4e7d70] scale-105'
              : 'w-40 h-40 bg-gradient-to-tr from-[#32584e] to-[#3d695d] scale-95'
          }`}
        >
          <span className="text-lg font-bold uppercase tracking-widest">{phase}</span>
          <span className="text-4xl font-extrabold font-mono mt-0.5">{secondsLeft}</span>
          <span className="text-[10px] text-[#dbe9e3] font-medium">seconds</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-5 py-2.5 rounded-2xl bg-[#2d3748] hover:bg-[#1a202c] text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Resume'}</span>
        </button>

        <span className="text-xs font-mono text-[#718096]">
          Completed: <strong>{cyclesCompleted}</strong> cycles
        </span>
      </div>

      <p className="text-[11px] text-[#a0aec0] max-w-xs mx-auto leading-relaxed">
        Equalized rhythmic breathing stimulates the vagus nerve and gently drops your heart rate.
      </p>
    </div>
  );
}

// 3. Progressive Muscle Relaxation View
function MuscleRelaxationView() {
  const steps = [
    { target: 'Feet & Toes', instruct: 'Gently curl your toes downward. Notice the subtle tension in your arches. Hold for 5 seconds... Now release completely. Feel the warmth returning.' },
    { target: 'Calves & Lower Legs', instruct: 'Point your toes back up toward your shins. Feel the tension in your calf muscles. Hold... and release. Let your legs go completely limp.' },
    { target: 'Thighs & Hips', instruct: 'Gently press your thighs together. Feel the firm contact with your chair or bed. Hold... and exhale, letting all heaviness dissolve.' },
    { target: 'Stomach & Belly', instruct: 'Tighten your abdominal muscles softly. Hold... and breathe out slowly, allowing your stomach to soften and rise with each breath.' },
    { target: 'Shoulders & Neck', instruct: 'Lift your shoulders gently toward your ears. Hold the tightness... and drop them completely down. Feel your neck lengthen and relax.' },
    { target: 'Hands & Arms', instruct: 'Gently clench your fists. Notice the forearms. Hold... and open your palms softly, letting your fingers rest loosely.' },
    { target: 'Face & Jaw', instruct: 'Unclench your jaw, soften your eyebrows, and allow your tongue to rest gently on the roof of your mouth. Exhale completely.' },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#ece8df] shadow-xs max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-1">
        <span className="px-3 py-1 bg-[#f5f2eb] text-[#7c6f5d] rounded-full text-xs font-semibold font-mono">
          Somatic Release
        </span>
        <h2 className="text-xl font-bold text-[#2d3748]">Progressive Muscle Relaxation</h2>
        <p className="text-xs text-[#718096]">Group {currentIdx + 1} of {steps.length}: {steps[currentIdx].target}</p>
      </div>

      <div className="bg-[#fbfaf8] p-6 rounded-2xl border border-[#ece8df] text-center space-y-2.5">
        <h3 className="text-base font-bold text-[#3d695d]">{steps[currentIdx].target}</h3>
        <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed max-w-sm mx-auto">
          {steps[currentIdx].instruct}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl bg-[#f7f5f0] text-[#718096] disabled:opacity-30 text-xs font-semibold"
        >
          Previous
        </button>

        <button
          onClick={() => {
            if (currentIdx < steps.length - 1) {
              setCurrentIdx(currentIdx + 1);
            } else {
              api.recordGrounding('pmr', 180).catch(console.error);
              alert("Muscle relaxation complete. Notice the lightness in your body.");
              setCurrentIdx(0);
            }
          }}
          className="px-5 py-2 rounded-xl bg-[#3d695d] hover:bg-[#34594f] text-white text-xs font-semibold shadow-2xs"
        >
          {currentIdx < steps.length - 1 ? 'Next Group →' : 'Finish PMR'}
        </button>
      </div>
    </div>
  );
}

// 4. Safe Place View
function SafePlaceView() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#ece8df] shadow-xs max-w-lg mx-auto space-y-6 text-center">
      <div>
        <span className="px-3 py-1 bg-[#edf1f8] text-[#486b9e] rounded-full text-xs font-semibold font-mono">
          Mental Sanctuary
        </span>
        <h2 className="text-xl font-bold text-[#2d3748] mt-2">Safe Place Visualization</h2>
      </div>

      <div className="space-y-3.5 text-xs sm:text-sm text-[#4a5568] leading-relaxed text-left bg-[#fbfaf8] p-6 rounded-2xl border border-[#ece8df]">
        <p><strong>1. Soften your gaze:</strong> Picture a sanctuary where you feel completely secure and undisturbed. It could be a quiet porch during rain, a sunny field, or a quiet reading nook.</p>
        <p><strong>2. What colors surround you?</strong> Notice the soothing greens, calm blues, or soft amber sunlight.</p>
        <p><strong>3. Notice the sounds:</strong> A quiet breeze rustling leaves, gentle waves, or comforting stillness.</p>
        <p><strong>4. Anchor this place:</strong> Remind yourself: <em>"This sanctuary exists inside my awareness. I can return here anytime my nervous system needs rest."</em></p>
      </div>

      <button
        onClick={() => {
          api.recordGrounding('safe_place', 120).catch(console.error);
          alert("Safe Place session recorded.");
        }}
        className="px-6 py-2.5 rounded-2xl bg-[#3d695d] hover:bg-[#34594f] text-white text-xs font-semibold shadow-2xs"
      >
        Complete Session
      </button>
    </div>
  );
}

// 5. Calm Sanctuary View
function CalmModeView() {
  return (
    <div className="bg-[#24332f] text-white rounded-3xl p-10 md:p-16 text-center max-w-xl mx-auto space-y-6 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-white/10 mx-auto flex items-center justify-center animate-serene-breathe">
        <Wind className="w-7 h-7 text-[#9fe0cc]" />
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
        Breathe gently.
      </h2>

      <p className="text-base md:text-lg text-[#b8e8db] font-light max-w-md mx-auto leading-relaxed">
        You are here right now.
      </p>

      <p className="text-xs text-[#8ea7a0] max-w-xs mx-auto leading-relaxed pt-2">
        The trauma is not occurring right now. Take a quiet, unhurried breath in through your nose, and a slow, gentle exhale.
      </p>
    </div>
  );
}
