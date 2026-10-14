import React, { useState } from 'react';
import "./CheckIn.css";
import {
  ClipboardList,
  CheckCircle2,
  Moon,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function CheckIn({ setActiveTab }) {
  const [mood, setMood] = useState('Okay');
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(6.5);
  const [nightmares, setNightmares] = useState(false);
  const [flashbacks, setFlashbacks] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const moodOptions = [
    { label: 'Calm', icon: Smile, color: 'text-[#2d564b] bg-[#eaf1ed] border-[#cbe0d6]' },
    { label: 'Okay', icon: Meh, color: 'text-[#486b9e] bg-[#edf1f8] border-[#d6e0ef]' },
    { label: 'Sad', icon: Frown, color: 'text-[#6d5b94] bg-[#f2eff8] border-[#e0d6f2]' },
    { label: 'Anxious', icon: Zap, color: 'text-[#9c6a38] bg-[#f7efe5] border-[#eedac3]' },
    { label: 'Angry', icon: Flame, color: 'text-[#be4c47] bg-[#fdedeb] border-[#f5cfcb]' },
    { label: 'Fearful', icon: ShieldAlert, color: 'text-[#7b5ca8] bg-[#f5effb] border-[#e4d4f7]' },
  ];

  const triggerOptions = [
    'Loud noises / Sudden sounds',
    'Crowded places',
    'Specific smells / sensory cues',
    'Anniversary dates / memories',
    'Work / Task overload',
    'Interpersonal conflict'
  ];

  const toggleTrigger = (trig) => {
    setSelectedTriggers((prev) =>
      prev.includes(trig) ? prev.filter((t) => t !== trig) : [...prev, trig]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const allTriggers = [...selectedTriggers];
      if (customTrigger.trim()) allTriggers.push(customTrigger.trim());

      await api.createCheckin({
        mood,
        stress: parseInt(stress, 10),
        sleepHours: parseFloat(sleepHours),
        nightmares,
        flashbacks,
        triggers: allTriggers.join(', ')
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Checkin error:', err);
      alert('Failed to save check-in. Please ensure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ece8df] shadow-xs">
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-7">
            
            <div className="text-center space-y-1">
              <span className="px-3 py-1 bg-[#f5f2eb] text-[#7c6f5d] rounded-full text-xs font-semibold font-mono">
                Gentle Self-Reflection
              </span>
              <h1 className="text-2xl font-bold text-[#2d3748] mt-2">Daily Wellness Check-In</h1>
              <p className="text-xs text-[#718096]">
                Notice how your body and mind are feeling today. No clinical diagnoses are made.
              </p>
            </div>

            {/* 1. Mood Selection */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096]">
                1. What best describes your primary mood?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {moodOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = mood === opt.label;
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setMood(opt.label)}
                      className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                        isSelected
                          ? `${opt.color} ring-2 ring-[#3d695d]/20 shadow-2xs scale-102`
                          : 'bg-[#fbfaf8] border-[#ece8df] text-[#64748b] hover:bg-[#f7f5f0]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Stress Level Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                  2. Current Stress & Tension Level (1 - 10)
                </label>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg font-mono ${
                  stress >= 7 ? 'bg-[#fdedeb] text-[#be4c47]' : stress >= 4 ? 'bg-[#fbf2e9] text-[#875525]' : 'bg-[#eaf1ed] text-[#2d564b]'
                }`}>
                  {stress} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className="w-full accent-[#3d695d] cursor-pointer h-2 bg-[#ece8df] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#a0aec0] font-medium">
                <span>1 (Calm & Settled)</span>
                <span>5 (Moderate Tension)</span>
                <span>10 (Acute Overwhelm)</span>
              </div>
            </div>

            {/* 3. Sleep Hours */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096]">
                3. Approximate Sleep Duration Last Night
              </label>
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-[#486b9e] shrink-0" />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-28 px-3.5 py-2 bg-[#fbfaf8] rounded-2xl border border-[#ded8cc] font-bold text-xs text-[#2d3748]"
                />
                <span className="text-xs text-[#718096]">hours</span>
              </div>
            </div>

            {/* 4. Symptoms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-[#fbfaf8] rounded-2xl border border-[#ece8df] space-y-2">
                <span className="text-xs font-semibold text-[#2d3748] block">Experienced Nightmares?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNightmares(true)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
                      nightmares ? 'bg-[#3d695d] text-white' : 'bg-white border border-[#ded8cc] text-[#64748b]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setNightmares(false)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
                      !nightmares ? 'bg-[#3d695d] text-white' : 'bg-white border border-[#ded8cc] text-[#64748b]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#fbfaf8] rounded-2xl border border-[#ece8df] space-y-2">
                <span className="text-xs font-semibold text-[#2d3748] block">Experienced Flashbacks?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFlashbacks(true)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
                      flashbacks ? 'bg-[#3d695d] text-white' : 'bg-white border border-[#ded8cc] text-[#64748b]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlashbacks(false)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
                      !flashbacks ? 'bg-[#3d695d] text-white' : 'bg-white border border-[#ded8cc] text-[#64748b]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Triggers */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#718096]">
                5. Any Specific Triggers Encountered Today? (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {triggerOptions.map((trig) => {
                  const isChecked = selectedTriggers.includes(trig);
                  return (
                    <button
                      type="button"
                      key={trig}
                      onClick={() => toggleTrigger(trig)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-[#eaf1ed] border-[#cbe0d6] text-[#2d564b] font-bold'
                          : 'bg-[#fbfaf8] border-[#ece8df] text-[#64748b] hover:bg-[#f7f5f0]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {trig}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                placeholder="Other specific trigger (optional)..."
                className="w-full px-3.5 py-2 bg-[#fbfaf8] rounded-xl border border-[#ded8cc] text-xs text-[#2d3748]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 border-t border-[#f4f1ea]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#3d695d] hover:bg-[#34594f] text-white rounded-2xl text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Saving Check-In...' : 'Record Check-In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        ) : (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-[#eaf1ed] text-[#3d695d] rounded-2xl mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#2d3748]">Check-In Saved</h2>
            <p className="text-xs text-[#718096] max-w-sm mx-auto leading-relaxed">
              Your reflection has been recorded. You can view your weekly patterns anytime on the Wellness Dashboard.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-2xl bg-[#3d695d] hover:bg-[#34594f] text-white text-xs font-semibold shadow-2xs"
              >
                View Dashboard
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-5 py-2.5 rounded-2xl bg-[#f7f5f0] hover:bg-[#ebe6dc] text-[#4a5568] text-xs font-semibold"
              >
                Return to Chat
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
