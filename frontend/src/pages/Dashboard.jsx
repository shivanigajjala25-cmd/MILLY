import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import {
  BarChart3,
  Moon,
  Zap,
  Sparkles,
  Smile,
  Info,
  Calendar,
  AlertCircle,
  RefreshCw,
  Heart
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard({ setActiveTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-[#718096]">
        <RefreshCw className="w-7 h-7 animate-spin mx-auto text-[#3d695d] mb-2" />
        <p className="text-xs">Gathering your wellness reflections...</p>
      </div>
    );
  }

  const chartData = data?.weeklyData || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-[#eaf1ed] text-[#2d564b] rounded-full text-xs font-semibold font-mono">
            Descriptive Trends
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2d3748] mt-2">
            Wellness & Symptom Dashboard
          </h1>
          <p className="text-xs text-[#718096]">
            Descriptive overview of your reported stress and sleep patterns.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#ece8df] hover:bg-[#f7f5f0] rounded-xl text-xs font-semibold text-[#4a5568] shadow-2xs w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#3d695d]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Pattern Summary Card */}
      <div className="bg-[#f5f8f6] p-5 rounded-3xl border border-[#dce8e2] shadow-2xs flex items-start gap-3.5">
        <div className="p-2.5 bg-[#eaf1ed] rounded-2xl text-[#3d695d] shrink-0 border border-[#cbe0d6]">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs leading-relaxed text-[#2d564b]">
          <h2 className="font-bold text-sm text-[#24453c]">Weekly Pattern Observation</h2>
          <p className="text-[#3d695d] font-normal">{data?.descriptiveInsight}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-[#ece8df] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#a0aec0]">
            <span className="text-xs font-medium">Latest Mood</span>
            <Smile className="w-4 h-4 text-[#3d695d]" />
          </div>
          <div className="text-2xl font-bold text-[#2d3748] capitalize">
            {data?.currentMood || 'N/A'}
          </div>
          <p className="text-[11px] text-[#a0aec0]">Most recent check-in</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ece8df] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#a0aec0]">
            <span className="text-xs font-medium">Average Stress</span>
            <Zap className="w-4 h-4 text-[#9c6a38]" />
          </div>
          <div className="text-2xl font-bold text-[#2d3748] font-mono">
            {data?.weeklyAverageStress || '0.0'} <span className="text-xs font-normal text-[#a0aec0]">/ 10</span>
          </div>
          <p className="text-[11px] text-[#a0aec0]">7-day rolling average</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ece8df] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#a0aec0]">
            <span className="text-xs font-medium">Average Sleep</span>
            <Moon className="w-4 h-4 text-[#486b9e]" />
          </div>
          <div className="text-2xl font-bold text-[#2d3748] font-mono">
            {data?.weeklyAverageSleep || '0.0'} <span className="text-xs font-normal text-[#a0aec0]">hrs</span>
          </div>
          <p className="text-[11px] text-[#a0aec0]">Reported sleep hours</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ece8df] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#a0aec0]">
            <span className="text-xs font-medium">Grounding Sessions</span>
            <Sparkles className="w-4 h-4 text-[#3d695d]" />
          </div>
          <div className="text-2xl font-bold text-[#3d695d] font-mono">
            {data?.groundingSessionsCount || 0}
          </div>
          <p className="text-[11px] text-[#a0aec0]">Completed exercises</p>
        </div>

      </div>

      {/* Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stress Trend Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#ece8df] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#2d3748]">Weekly Stress Trajectory</h2>
              <p className="text-xs text-[#a0aec0]">Tension level (1 to 10 scale)</p>
            </div>
            <span className="text-xs font-semibold text-[#875525] bg-[#fbf2e9] px-2.5 py-0.5 rounded-lg border border-[#edd7c2]">
              Stress (1-10)
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f1ea" />
                <XAxis dataKey="day" stroke="#a0aec0" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#a0aec0" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #ece8df', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  name="Stress Level"
                  stroke="#3d695d"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3d695d' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Duration Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#ece8df] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#2d3748]">Sleep Duration</h2>
              <p className="text-xs text-[#a0aec0]">Nightly sleep in hours</p>
            </div>
            <span className="text-xs font-semibold text-[#486b9e] bg-[#edf1f8] px-2.5 py-0.5 rounded-lg border border-[#d6e0ef]">
              Hours
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f1ea" />
                <XAxis dataKey="day" stroke="#a0aec0" fontSize={11} />
                <YAxis domain={[0, 12]} stroke="#a0aec0" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #ece8df', fontSize: '12px' }}
                />
                <Bar
                  dataKey="sleep"
                  name="Sleep Hours"
                  fill="#5c7ca8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Check-Ins Table */}
      <div className="bg-white p-6 rounded-3xl border border-[#ece8df] shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-[#2d3748]">Recent Daily Check-In Records</h2>

        {data?.recentCheckins && data.recentCheckins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4a5568]">
              <thead className="border-b border-[#ece8df] text-[#a0aec0] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mood</th>
                  <th className="py-2.5 px-3">Stress</th>
                  <th className="py-2.5 px-3">Sleep</th>
                  <th className="py-2.5 px-3">Symptoms</th>
                  <th className="py-2.5 px-3">Triggers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f1ea]">
                {data.recentCheckins.map((chk) => (
                  <tr key={chk.id} className="hover:bg-[#fbfaf8]">
                    <td className="py-3 px-3 font-medium text-[#2d3748]">
                      {chk.createdAt ? new Date(chk.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f5f2eb] text-[#5c5446] font-semibold capitalize">
                        {chk.mood}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#2d3748]">
                      {chk.stress}/10
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {chk.sleepHours} hrs
                    </td>
                    <td className="py-3 px-3 space-x-1">
                      {chk.nightmares && (
                        <span className="px-1.5 py-0.5 bg-[#fdedeb] text-[#be4c47] rounded text-[10px]">
                          Nightmares
                        </span>
                      )}
                      {chk.flashbacks && (
                        <span className="px-1.5 py-0.5 bg-[#f5effb] text-[#7b5ca8] rounded text-[10px]">
                          Flashbacks
                        </span>
                      )}
                      {!chk.nightmares && !chk.flashbacks && (
                        <span className="text-[#cbd5e1]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#718096] max-w-xs truncate">
                      {chk.triggers || 'None recorded'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#a0aec0] italic">No check-ins recorded yet.</p>
        )}
      </div>

    </div>
  );
}
