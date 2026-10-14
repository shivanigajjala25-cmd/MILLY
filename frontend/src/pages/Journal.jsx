import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Trash2,
  Edit3,
  Search,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function Journal({ setActiveTab }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [journalSessionToken, setJournalSessionToken] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteMoodTag, setNoteMoodTag] = useState('Personal');

  const [copiedId, setCopiedId] = useState(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');

  const handleVerifyPin = async (e) => {
    e?.preventDefault();
    if (!pinInput || pinInput.length < 4) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }

    setVerifying(true);
    setPinError('');
    try {
      const res = await api.verifyJournalPin(pinInput);
      if (res.authenticated) {
        setIsAuthenticated(true);
        setJournalSessionToken(res.sessionToken);
        loadEntries(res.sessionToken);
      } else {
        setPinError('Incorrect PIN.');
      }
    } catch (err) {
      setPinError('Incorrect PIN or journal service unavailable.');
    } finally {
      setVerifying(false);
    }
  };

  const loadEntries = async (sessionToken = journalSessionToken) => {
    try {
      setLoadingEntries(true);
      const res = await api.getJournalEntries(sessionToken);
      setEntries(res || []);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim()) return;

    try {
      if (editingId) {
        await api.updateJournalEntry(editingId, {
          title: noteTitle.trim() || 'Untitled',
          content: noteContent.trim(),
          moodTag: noteMoodTag
        }, journalSessionToken);
      } else {
        await api.createJournalEntry({
          title: noteTitle.trim() || 'Untitled',
          content: noteContent.trim(),
          moodTag: noteMoodTag
        }, journalSessionToken);
      }

      setIsCreating(false);
      setEditingId(null);
      setNoteTitle('');
      setNoteContent('');
      loadEntries();
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Error saving note.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this private journal note?')) return;
    try {
      await api.deleteJournalEntry(id, journalSessionToken);
      loadEntries();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setNoteTitle(entry.title);
    setNoteContent(entry.content);
    setNoteMoodTag(entry.moodTag || 'Personal');
    setIsCreating(true);
  };

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    if (newPinValue.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    try {
      await api.setJournalPin(newPinValue, journalSessionToken);
      alert('PIN updated successfully!');
      setIsChangingPin(false);
      setNewPinValue('');
    } catch (err) {
      alert('Failed to update PIN');
    }
  };

  const filteredEntries = entries.filter((ent) =>
    (ent.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ent.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ent.moodTag || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Reassuring Zero-AI Privacy Notice */}
      <div className="bg-[#f5f2eb] border border-[#e2ded7] rounded-3xl p-5 text-[#4a5568] shadow-2xs flex items-start gap-3.5">
        <div className="p-2.5 bg-white rounded-2xl text-[#3d695d] shrink-0 border border-[#e2ded7]">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#2d3748]">
              Private Journal Sanctuary
            </h2>
            <span className="px-2 py-0.5 bg-white text-[#3d695d] rounded-md font-mono text-[10px] font-semibold border border-[#e2ded7]">
              Zero AI Access
            </span>
          </div>
          <p className="leading-relaxed text-[#718096]">
            This digital journal is isolated from the conversational pipeline. <strong>MILLY cannot read, index, or summarize these entries.</strong> Your reflections remain strictly confidential behind your passcode.
          </p>
        </div>
      </div>

      {/* Lock Screen */}
      {!isAuthenticated ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#ece8df] shadow-xs max-w-sm mx-auto text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#f5f2eb] text-[#3d695d] mx-auto flex items-center justify-center">
            <KeyRound className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#2d3748]">Passcode Protected</h3>
            <p className="text-xs text-[#718096] mt-1">
              Enter your PIN to open your private reflections.
            </p>
            <p className="text-[11px] text-[#3d695d] font-mono mt-1">
              (Prototype default: <strong>1234</strong>)
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-40 mx-auto text-center tracking-widest text-2xl font-mono px-4 py-2.5 bg-[#fbfaf8] rounded-2xl border border-[#ded8cc] focus:outline-hidden focus:border-[#3d695d]"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-[#be4c47] font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-2.5 bg-[#3d695d] hover:bg-[#34594f] text-white rounded-2xl text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{verifying ? 'Unlocking...' : 'Unlock Journal'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Journal */
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#ece8df] shadow-2xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#a0aec0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#fbfaf8] rounded-xl border border-[#ded8cc] text-xs focus:outline-hidden focus:border-[#3d695d]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingId(null);
                  setNoteTitle('');
                  setNoteContent('');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3d695d] hover:bg-[#34594f] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Reflection</span>
              </button>

              <button
                onClick={() => setIsChangingPin(true)}
                className="px-3 py-1.5 bg-[#f7f5f0] hover:bg-[#ebe6dc] text-[#4a5568] rounded-xl text-xs font-medium"
              >
                Change PIN
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPinInput('');
                }}
                className="px-3 py-1.5 bg-[#f7f5f0] hover:bg-[#fdedeb] hover:text-[#be4c47] text-[#718096] rounded-xl text-xs font-medium flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            </div>
          </div>

          {/* Change PIN modal */}
          {isChangingPin && (
            <div className="p-4 bg-white rounded-2xl border border-[#ded8cc] space-y-2.5">
              <h4 className="text-xs font-bold text-[#2d3748]">Set New Passcode</h4>
              <form onSubmit={handleChangePin} className="flex gap-2">
                <input
                  type="password"
                  maxLength={8}
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="New 4+ digit PIN"
                  className="px-3 py-1.5 bg-[#fbfaf8] border rounded-xl text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3d695d] text-white rounded-xl text-xs font-semibold"
                >
                  Save PIN
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="px-3 py-1.5 bg-[#f7f5f0] text-[#718096] rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Note Editor */}
          {isCreating && (
            <div className="bg-white p-6 rounded-3xl border border-[#3d695d]/30 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2d3748]">
                  {editingId ? 'Edit Private Reflection' : 'Write Private Reflection'}
                </h3>
                <span className="text-[11px] text-[#3d695d] font-mono">🔒 Zero AI Access</span>
              </div>

              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Title..."
                className="w-full px-4 py-2.5 bg-[#fbfaf8] rounded-2xl border border-[#ded8cc] text-sm font-bold focus:outline-hidden focus:border-[#3d695d]"
              />

              <div className="flex gap-2">
                {['Personal', 'Reflection', 'Triggers', 'Gratitude'].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setNoteMoodTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border ${
                      noteMoodTag === tag
                        ? 'bg-[#eaf1ed] text-[#2d564b] border-[#cbe0d6]'
                        : 'bg-[#fbfaf8] text-[#718096] border-[#ded8cc]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                rows={6}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Pour out your thoughts freely. These words remain strictly protected on your device..."
                className="w-full px-4 py-3 bg-[#fbfaf8] rounded-2xl border border-[#ded8cc] text-sm leading-relaxed focus:outline-hidden focus:border-[#3d695d]"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-[#f7f5f0] text-[#718096] rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-5 py-2 bg-[#3d695d] hover:bg-[#34594f] text-white rounded-xl text-xs font-semibold shadow-2xs"
                >
                  Save Reflection
                </button>
              </div>
            </div>
          )}

          {/* List of Entries */}
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-6 rounded-3xl border border-[#ece8df] shadow-2xs hover:border-[#3d695d]/30 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#2d3748]">{entry.title}</h4>
                        {entry.moodTag && (
                          <span className="px-2 py-0.5 bg-[#f5f2eb] text-[#7c6f5d] rounded-md text-[10px] font-semibold">
                            {entry.moodTag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#a0aec0] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Date'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyToClipboard(entry.content, entry.id)}
                        title="Copy note to manually paste into chat if you choose"
                        className="p-1.5 rounded-lg text-[#a0aec0] hover:text-[#2d3748] hover:bg-[#f7f5f0] transition-colors"
                      >
                        {copiedId === entry.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="p-1.5 rounded-lg text-[#a0aec0] hover:text-[#2d3748] hover:bg-[#f7f5f0] transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(entry.id)}
                        className="p-1.5 rounded-lg text-[#a0aec0] hover:text-[#be4c47] hover:bg-[#fdedeb] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>

                  <div className="pt-2 border-t border-[#f4f1ea] flex items-center justify-between text-[11px] text-[#a0aec0]">
                    <span className="font-mono">🔒 Isolated table</span>
                    <button
                      onClick={() => {
                        handleCopyToClipboard(entry.content, entry.id);
                        setActiveTab('chat');
                      }}
                      className="text-[#3d695d] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Copy & Discuss with MILLY →</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-[#ece8df] text-center space-y-3">
                <BookOpen className="w-10 h-10 text-[#cbd5e1] mx-auto" />
                <h4 className="text-sm font-bold text-[#4a5568]">No Reflections Found</h4>
                <p className="text-xs text-[#a0aec0] max-w-sm mx-auto">
                  {searchQuery ? 'No notes matched your search.' : 'Write your first private note. Your reflections are protected behind your PIN.'}
                </p>
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-[#3d695d] hover:bg-[#34594f] text-white rounded-xl text-xs font-semibold"
                  >
                    Write First Note
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
