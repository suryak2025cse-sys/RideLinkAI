import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VoiceCommandHandler({ onCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const isSpeechSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const toggleListening = () => {
    if (!isSpeechSupported) {
      setFeedback('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening for voice commands...');
      setFeedback(null);
    };

    recognition.onresult = (event) => {
      const commandText = event.results[0][0].transcript.toLowerCase();
      setTranscript(`"${commandText}"`);
      processCommand(commandText);
      setIsListening(false);
    };

    recognition.onerror = (err) => {
      console.log('[Voice Error]:', err.error);
      setIsListening(false);
      setFeedback('Voice command timeout. Click mic to retry.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = (cmd) => {
    if (cmd.includes('dashboard') || cmd.includes('home')) {
      setFeedback('Navigating to Dashboard...');
      setTimeout(() => navigate('/passenger'), 800);
    } else if (cmd.includes('driver') || cmd.includes('offer')) {
      setFeedback('Opening Driver Portal...');
      setTimeout(() => navigate('/driver'), 800);
    } else if (cmd.includes('safety') || cmd.includes('women')) {
      setFeedback('Opening Safety Portal...');
      setTimeout(() => navigate('/women-safety'), 800);
    } else if (cmd.includes('tracking') || cmd.includes('navigate')) {
      setFeedback('Opening Live GPS Tracking...');
      setTimeout(() => navigate('/tracking'), 800);
    } else if (cmd.includes('accept') || cmd.includes('book')) {
      setFeedback('Executing ride action...');
      if (onCommand) onCommand('ACCEPT_RIDE');
    } else {
      setFeedback(`Recognized command: "${cmd}". Say "Open Driver", "Dashboard", or "Safety".`);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={toggleListening}
        type="button"
        className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-black ${
          isListening 
            ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-md' 
            : 'bg-white text-slate-900 border-slate-300 hover:border-amber-400 shadow-sm'
        }`}
        title={isSpeechSupported ? 'Click to speak voice commands' : 'Speech recognition unavailable'}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Voice Control</span>
          </>
        )}
      </button>

      {feedback && (
        <span className="text-xs font-extrabold text-slate-700 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full animate-in fade-in">
          {feedback}
        </span>
      )}
    </div>
  );
}
