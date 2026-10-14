import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-1.5 px-4 text-center flex items-center justify-center gap-2">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      <p className="text-[11px] text-amber-700 font-medium">
        MILLY is an educational AI prototype — not a medical service. For emergencies call <strong>112</strong> or your local crisis line.
      </p>
    </div>
  );
}
