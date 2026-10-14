import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-200">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3 text-rose-700">
            <div className="p-2 bg-rose-100 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Immediate Support Resources</h2>
              <p className="text-xs text-rose-600 font-medium">You deserve compassionate human care</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-slate-700 text-sm">
          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs leading-relaxed">
            <p className="font-semibold mb-1">If you are in immediate physical danger:</p>
            <p>Please call your local emergency services (<strong>911</strong> in the US/Canada, <strong>112</strong> in Europe/India, <strong>999</strong> in the UK) or go to the nearest emergency hospital immediately.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">988 Suicide & Crisis Lifeline</p>
                <p className="text-xs text-slate-500">Free, confidential 24/7 support (US & Canada)</p>
              </div>
              <a
                href="tel:988"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call 988
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">Crisis Text Line</p>
                <p className="text-xs text-slate-500">Text with a trained crisis counselor 24/7</p>
              </div>
              <span className="px-3 py-1 bg-slate-200 text-slate-800 rounded-lg text-xs font-mono font-bold">
                Text HOME to 741741
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">Veterans Crisis Line</p>
                <p className="text-xs text-slate-500">Specialized military & trauma support</p>
              </div>
              <a
                href="tel:988"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Dial 988, Press 1
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">International Resources (Befrienders Worldwide)</p>
                <p className="text-xs text-slate-500">Confidential emotional support worldwide</p>
              </div>
              <a
                href="https://www.befrienders.org"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                Find Directory →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
