import React, { useEffect, useState } from 'react';
import { Cpu, X, Sparkles, Database, CheckCircle2, RefreshCw, BarChart2 } from 'lucide-react';
import { api } from '../services/api';

export default function AiInsightModal({ isOpen, onClose, currentInsight }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
    }
  }, [isOpen]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.getModelMetrics();
      setMetrics(res);
    } catch (e) {
      console.error('Failed to load metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-teal-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-teal-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-xl text-teal-700">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">AI / NLP Architecture & Insights</h2>
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md text-xs font-mono font-semibold">Demo Mode</span>
              </div>
              <p className="text-xs text-slate-500">Real-time Java TF-IDF & Logistic Regression Diagnostics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Turn Real-Time Inference */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-teal-600" /> Current Message Inference State
          </h3>
          {currentInsight ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-mono">Predicted Intent</span>
                <span className="font-bold text-teal-700 text-sm capitalize">{currentInsight.intent || 'N/A'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-mono">Detected Emotion</span>
                <span className="font-bold text-indigo-700 text-sm capitalize">{currentInsight.emotion || 'N/A'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-mono">Model Confidence</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {currentInsight.confidence ? `${Math.round(currentInsight.confidence * 100)}%` : 'N/A'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-mono">Recommended Action</span>
                <span className="font-bold text-amber-700 text-sm uppercase">{currentInsight.recommendedAction || 'None'}</span>
              </div>

              <div className="col-span-2 md:col-span-4 bg-white p-2.5 rounded-lg border border-slate-100 mt-1">
                <span className="text-slate-400 block font-mono mb-1">RAG Retrieved Knowledge Topics:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentInsight.retrievedTopics && currentInsight.retrievedTopics.length > 0 ? (
                    currentInsight.retrievedTopics.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-800 rounded text-xs font-medium">
                        ✓ {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None retrieved for general dialog</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              No message sent yet in this session. Send a message in the chat to see real-time inference telemetry!
            </div>
          )}
        </div>

        {/* Supervised ML Evaluation Metrics */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-teal-600" /> Supervised Model Evaluation (Train/Test Split)
            </h3>
            <button
              onClick={loadMetrics}
              disabled={loading}
              className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {metrics ? (
            <div className="space-y-4">
              {/* Intent Classifier Metrics */}
              {metrics.intentModel && (
                <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-teal-900">1. Intent Classifier (TF-IDF + Multinomial Logistic Regression)</span>
                    <span className="text-slate-500 font-mono text-[11px]">N = {metrics.intentModel.totalSamples} samples</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-teal-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Accuracy</div>
                      <div className="font-bold text-teal-700 text-sm">{(metrics.intentModel.accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-teal-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Precision</div>
                      <div className="font-bold text-slate-800 text-sm">{metrics.intentModel.precision.toFixed(3)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-teal-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Recall</div>
                      <div className="font-bold text-slate-800 text-sm">{metrics.intentModel.recall.toFixed(3)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-teal-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">F1-Score</div>
                      <div className="font-bold text-emerald-700 text-sm">{metrics.intentModel.f1Score.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emotion Classifier Metrics */}
              {metrics.emotionModel && (
                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-900">2. Emotion Classifier (7-Class Softmax Regression)</span>
                    <span className="text-slate-500 font-mono text-[11px]">N = {metrics.emotionModel.totalSamples} samples</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Accuracy</div>
                      <div className="font-bold text-indigo-700 text-sm">{(metrics.emotionModel.accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Precision</div>
                      <div className="font-bold text-slate-800 text-sm">{metrics.emotionModel.precision.toFixed(3)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Recall</div>
                      <div className="font-bold text-slate-800 text-sm">{metrics.emotionModel.recall.toFixed(3)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">F1-Score</div>
                      <div className="font-bold text-indigo-700 text-sm">{metrics.emotionModel.f1Score.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 text-slate-400 rounded-xl text-center text-xs">
              Loading trained metrics...
            </div>
          )}
        </div>

        {/* Academic / Presentation Architecture Notes */}
        <div className="mt-6 p-3.5 bg-stone-100 rounded-xl text-[11px] text-stone-600 leading-relaxed border border-stone-200">
          <p className="font-semibold text-stone-800 mb-1">Architecture Highlights for College Presentation:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>Zero External APIs:</strong> 100% self-hosted, deterministic, zero OpenAI / Gemini API dependencies.</li>
            <li><strong>Mathematical NLP:</strong> Native Java TF-IDF vectorizer + Gradient Descent Softmax with L2 regularization.</li>
            <li><strong>Local Knowledge Retrieval (RAG):</strong> Cosine similarity index over 20 curated PTSD educational articles.</li>
            <li><strong>Privacy Barrier:</strong> The private journal is kept in a separate PIN-isolated table that the AI model cannot access.</li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
