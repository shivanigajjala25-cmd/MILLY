
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Heart,
  User,
  ShieldAlert,
  Wind,
  Info,
  Cpu,
  Mic,
  MicOff
} from 'lucide-react';
import { api } from '../services/api';

export default function Chat({
  setActiveTab,
  onOpenEmergency,
  onOpenAiInsight,
  setCurrentInsight
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'milly',
      text: "Hi, I'm MILLY. I'm here to listen, without rushing you. What's on your mind?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      intent: 'greeting',
      emotion: 'calm',
      confidence: 1,
      retrievedTopics: [],
      recommendedAction: 'none',
      crisis: false
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [shareWellness, setShareWellness] = useState(false);

  const [sessionId] = useState(
    () => 'sess_' + Math.random().toString(36).slice(2, 11)
  );

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleSendRef = useRef(null);

  // Speech recognition state is kept in refs so it survives
  // browser recognition restarts without losing earlier words.
  const listeningRef = useRef(false);
  const manualStopRef = useRef(false);
  const sendAfterStopRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const restartTimerRef = useRef(null);
  const voiceErrorRef = useRef('');

  const quickReplies = [
    'I feel a little anxious',
    "I'm having a difficult day",
    'Can you explain PTSD?',
    'I want to feel calmer'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, input]);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

  const handleSend = useCallback(async (textToSend) => {
    const text = (textToSend ?? input).trim();

    if (!text || loading) return;

    // Stop the microphone if a message is sent manually.
    if (listeningRef.current) {
      stopVoiceRecording(false);
    }

    setVoiceStatus('');

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: getTime()
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendMessage(
        text,
        sessionId,
        shareWellness
      );

      const botMessage = {
        id: Date.now() + 1,
        sender: 'milly',
        text: response.response,
        timestamp: getTime(),
        intent: response.intent,
        emotion: response.emotion,
        confidence: response.confidence,
        retrievedTopics: response.retrieved_topics || [],
        recommendedAction: response.recommended_action || 'none',
        crisis: Boolean(response.crisis)
      };

      setMessages((previous) => [...previous, botMessage]);

      setCurrentInsight?.({
        intent: response.intent,
        emotion: response.emotion,
        confidence: response.confidence,
        retrievedTopics: response.retrieved_topics || [],
        recommendedAction: response.recommended_action || 'none'
      });

      if (response.crisis) {
        onOpenEmergency?.();
      }
    } catch (error) {
      console.error('MILLY chat error:', error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: 'milly',
          text: "I'm having trouble connecting right now. Could you try sending that again in a moment?",
          timestamp: getTime(),
          crisis: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    input,
    loading,
    sessionId,
    shareWellness,
    setCurrentInsight,
    onOpenEmergency
  ]);

  // Always use the latest version of handleSend inside browser callbacks.
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const updateTranscriptInput = () => {
    const combined = [
      finalTranscriptRef.current.trim(),
      interimTranscriptRef.current.trim()
    ].filter(Boolean).join(' ');

    setInput(combined);
  };

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const stopVoiceRecording = (shouldSend = true) => {
    manualStopRef.current = true;
    listeningRef.current = false;
    sendAfterStopRef.current = shouldSend;
    clearRestartTimer();

    setIsListening(false);
    setVoiceStatus(
      shouldSend ? 'Finishing your transcription…' : ''
    );

    try {
      recognitionRef.current?.stop();
    } catch (error) {
      // The recognizer may already have stopped.
      finishVoiceRecording();
    }
  };

  const finishVoiceRecording = () => {
    const finalText = finalTranscriptRef.current.trim();

    listeningRef.current = false;
    manualStopRef.current = true;
    setIsListening(false);

    if (sendAfterStopRef.current && finalText) {
      sendAfterStopRef.current = false;
      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setInput('');
      setVoiceStatus('');

      handleSendRef.current?.(finalText);
      return;
    }

    sendAfterStopRef.current = false;

    if (finalText) {
      setInput(finalText);
      setVoiceStatus('Transcript ready. You can edit it or press Send.');
    } else if (voiceErrorRef.current) {
      setVoiceStatus(voiceErrorRef.current);
    } else {
      setVoiceStatus('No speech detected. Try recording again.');
    }

    voiceErrorRef.current = '';
  };

  const startVoiceRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus(
        'Voice recording is not supported in this browser. Try Chrome or Edge.'
      );
      return;
    }

    if (loading) return;

    clearRestartTimer();

    // A recognizer may be reused after a manual stop.
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    listeningRef.current = true;
    manualStopRef.current = false;
    sendAfterStopRef.current = false;
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    voiceErrorRef.current = '';

    setInput('');
    setIsListening(true);
    setVoiceStatus('Listening… take your time. Pause whenever you need.');

    recognition.onresult = (event) => {
      let newlyFinalized = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || '';

        if (result.isFinal) {
          newlyFinalized += transcript + ' ';
        } else {
          interimTranscriptRef.current += '';
        }
      }

      if (newlyFinalized.trim()) {
        finalTranscriptRef.current +=
          (finalTranscriptRef.current.trim() ? ' ' : '') +
          newlyFinalized.trim();

        interimTranscriptRef.current = '';
      }

      // Show both confirmed and currently recognized words.
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) {
          interim += event.results[i][0]?.transcript || '';
        }
      }

      interimTranscriptRef.current = interim;
      updateTranscriptInput();
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition event:', event.error);

      if (event.error === 'not-allowed' ||
          event.error === 'service-not-allowed') {
        voiceErrorRef.current =
          'Microphone access was denied. Allow microphone access in your browser settings.';
        listeningRef.current = false;
        manualStopRef.current = true;
        setIsListening(false);
        setVoiceStatus(voiceErrorRef.current);
        return;
      }

      if (event.error === 'audio-capture') {
        voiceErrorRef.current =
          'No microphone was found. Check that your microphone is connected.';
      } else if (event.error === 'network') {
        voiceErrorRef.current =
          'The browser speech service had a connection problem.';
      }

      // Some errors end a recognition session. onend will restart it
      // when the user has not manually stopped recording.
    };

    recognition.onend = () => {
      // If the user deliberately stopped, finish the recording.
      if (manualStopRef.current || !listeningRef.current) {
        finishVoiceRecording();
        return;
      }

      // Chrome may end a speech segment after silence even with
      // continuous=true. Restart it without clearing the transcript.
      clearRestartTimer();

      restartTimerRef.current = setTimeout(() => {
        if (!listeningRef.current || manualStopRef.current) return;

        try {
          const nextRecognition = new SpeechRecognition();

          nextRecognition.lang = 'en-IN';
          nextRecognition.continuous = true;
          nextRecognition.interimResults = true;
          nextRecognition.maxAlternatives = 1;

          recognitionRef.current = nextRecognition;

          // Attach the same handlers to the new recognition session.
          attachRecognitionHandlers(nextRecognition, SpeechRecognition);
          nextRecognition.start();
        } catch (error) {
          console.warn('Could not restart speech recognition:', error);
        }
      }, 300);
    };

    const attachRecognitionHandlers = (instance, RecognitionConstructor) => {
      instance.onresult = recognition.onresult;
      instance.onerror = recognition.onerror;
      instance.onend = recognition.onend;
    };

    try {
      recognition.start();
    } catch (error) {
      listeningRef.current = false;
      manualStopRef.current = true;
      setIsListening(false);
      setVoiceStatus(
        'Could not start the microphone. Please try clicking it again.'
      );
      console.error('Could not start speech recognition:', error);
    }
  };

  const toggleVoiceRecording = () => {
    if (listeningRef.current) {
      stopVoiceRecording(true);
    } else {
      startVoiceRecording();
    }
  };

  useEffect(() => {
    return () => {
      listeningRef.current = false;
      manualStopRef.current = true;
      clearRestartTimer();

      try {
        recognitionRef.current?.abort();
      } catch (error) {
        // Ignore cleanup errors.
      }
    };
  }, []);

  const submitMessage = (event) => {
    event.preventDefault();

    if (listeningRef.current) {
      // Finish recording and send its complete transcript.
      stopVoiceRecording(true);
      return;
    }

    handleSend();
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] min-h-[480px] w-full max-w-6xl flex-col overflow-hidden bg-[#29272e] text-[#f4eff8] sm:rounded-3xl">

      {/* Conversation */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-8">
        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#443b50] text-[#d9c2f0]">
                  <Heart className="h-5 w-5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl px-5 py-4 sm:max-w-[75%] ${
                  isUser
                    ? 'rounded-tr-md bg-[#584765] text-white'
                    : 'rounded-tl-md border border-white/5 bg-[#35323b] text-[#f5eff9]'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-7 sm:text-base">
                  {message.text}
                </p>

                <div className="mt-3 flex items-center justify-between gap-4 text-[11px] text-[#b6a7c6]">
                  <span>{message.timestamp}</span>

                  {!isUser && message.intent && message.intent !== 'greeting' && (
                    <button
                      type="button"
                      onClick={() => onOpenAiInsight?.()}
                      className="inline-flex items-center gap-1.5 transition hover:text-white"
                      title="View AI insight"
                    >
                      <Cpu className="h-3 w-3" />
                      AI Insight
                    </button>
                  )}
                </div>

                {!isUser && message.recommendedAction &&
                  message.recommendedAction !== 'none' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab?.('coping')}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#766482] bg-[#51465b] px-4 py-2 text-xs text-white transition hover:bg-[#62536e]"
                    >
                      <Wind className="h-4 w-4" />
                      Explore a coping exercise
                    </button>
                  )}

                {!isUser && message.crisis && (
                  <button
                    type="button"
                    onClick={() => onOpenEmergency?.()}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-xs text-red-100"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    View urgent support options
                  </button>
                )}
              </div>

              {isUser && (
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3c4545] text-[#b7d8cb]">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-[#c5b7d2]">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#cbb1e8]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#cbb1e8] [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#cbb1e8] [animation-delay:300ms]" />
            </div>
            MILLY is thinking…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        <span className="shrink-0 text-xs text-[#b6a7c6]">
          If it helps, you could start with…
        </span>

        {quickReplies.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => handleSend(reply)}
            disabled={loading || isListening}
            className="shrink-0 rounded-full border border-[#514957] px-4 py-2 text-xs text-[#e7dced] transition hover:border-[#b99bd5] hover:bg-[#413947] disabled:opacity-40"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="px-4 pb-3 pt-1 sm:px-6">
        <form
          onSubmit={submitMessage}
          className={`flex items-center gap-3 rounded-2xl border bg-[#35323b] p-2.5 transition ${
            isListening
              ? 'border-[#c4a5e4] shadow-[0_0_18px_rgba(196,165,228,0.12)]'
              : 'border-[#4a424f]'
          }`}
        >
          <button
            type="button"
            onClick={toggleVoiceRecording}
            disabled={loading}
            aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
            title={isListening ? 'Finish recording' : 'Start voice recording'}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40 ${
              isListening
                ? 'bg-[#b88cce] text-[#211b28] hover:bg-[#c8a5da]'
                : 'bg-[#4b4255] text-[#e0c9f2] hover:bg-[#5b4c68]'
            }`}
          >
            {isListening
              ? <MicOff className="h-5 w-5" />
              : <Mic className="h-5 w-5" />
            }
          </button>

          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              isListening
                ? 'Listening… pause whenever you need'
                : 'Talk or type to MILLY…'
            }
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-[#a89ab6] disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || (!input.trim() && !isListening)}
            aria-label={isListening ? 'Finish recording and send' : 'Send message'}
            title={isListening ? 'Finish recording and send' : 'Send message'}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8e789f] text-white transition hover:bg-[#a18ab4] disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2">
          <p className="text-[11px] text-[#a89ab6]">
            {isListening
              ? 'Still listening. Your words stay together until you finish recording.'
              : voiceStatus || 'Microphone speech is transcribed before being sent.'
            }
          </p>

          {isListening && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#d8b9f1]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d8b9f1]" />
              Listening
            </span>
          )}
        </div>

        <label className="mt-2 flex items-center gap-2 px-2 text-[11px] text-[#9e91aa]">
          <input
            type="checkbox"
            checked={shareWellness}
            onChange={(event) => setShareWellness(event.target.checked)}
            className="accent-[#b99bd5]"
          />
          Allow MILLY to use my wellness check-in context for this chat
          <span title="Your journal is never automatically shared with MILLY.">
            <Info className="h-3.5 w-3.5" />
          </span>
        </label>
      </div>
    </div>
  );
}
