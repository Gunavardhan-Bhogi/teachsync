import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play, AlertCircle } from 'lucide-react';

export default function LiveRecorder({ onAudioRecorded, audioFile }) {
  const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle' | 'recording' | 'paused' | 'stopped'
  const [timer, setTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 32000,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([audioBlob], `recorded-lecture-${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        onAudioRecorded(recordedFile);
        // stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // chunk every second
      setRecordingStatus('recording');
      setTimer(0);
      startTimer();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setErrorMsg(
        err.name === 'NotAllowedError'
          ? 'Microphone access was denied. Please allow microphone permissions.'
          : 'Failed to access microphone. Please check your audio inputs.'
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingStatus('paused');
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingStatus('recording');
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus !== 'idle') {
      mediaRecorderRef.current.stop();
      setRecordingStatus('stopped');
      stopTimer();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
      {errorMsg && (
        <div className="w-full mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Wave Visualization Box */}
      <div className="w-full h-32 bg-slate-950/80 border border-slate-800/80 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden px-8">
        {recordingStatus === 'recording' ? (
          <div className="flex items-center gap-1.5 h-16 w-full justify-center">
            {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 75, 55, 85, 40].map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full animate-wave"
                style={{
                  height: `${height}%`,
                  animationDelay: `${(i % 5) * 0.15}s`,
                }}
              />
            ))}
          </div>
        ) : recordingStatus === 'paused' ? (
          <div className="flex items-center gap-1.5 h-16 w-full justify-center opacity-40">
            {[30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30].map((height, i) => (
              <div key={i} className="w-1.5 bg-slate-500 rounded-full" style={{ height: '20%' }} />
            ))}
          </div>
        ) : audioFile ? (
          <div className="flex flex-col items-center text-indigo-400">
            <Mic className="w-8 h-8 mb-2 animate-pulse" />
            <span className="text-sm font-medium text-slate-200">Audio Recorded & Ready</span>
            <span className="text-xs text-slate-400 font-mono mt-1">{audioFile.name} ({(audioFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <Mic className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm">Click Start to begin recording live lecture audio (32kbps Opus)</span>
          </div>
        )}

        {/* Live Timer Display Overlay */}
        {(recordingStatus === 'recording' || recordingStatus === 'paused' || recordingStatus === 'stopped') && (
          <div className="absolute top-3 right-4 font-mono text-xs px-2.5 py-1 bg-slate-900/90 border border-slate-700/60 text-indigo-300 rounded-md">
            {formatTime(timer)}
          </div>
        )}
      </div>

      {/* Control Action Buttons */}
      <div className="flex items-center gap-4">
        {recordingStatus === 'idle' || recordingStatus === 'stopped' ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
          >
            <Mic className="w-5 h-5" />
            <span>{recordingStatus === 'stopped' ? 'Record Again' : 'Start Recording'}</span>
          </button>
        ) : (
          <>
            {recordingStatus === 'recording' ? (
              <button
                type="button"
                onClick={pauseRecording}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600/90 hover:bg-amber-500 text-white font-medium rounded-xl transition shadow-md"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={resumeRecording}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium rounded-xl transition shadow-md"
              >
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </button>
            )}

            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl shadow-lg shadow-rose-600/20 transition transform active:scale-95"
            >
              <Square className="w-4 h-4" />
              <span>Stop Recording</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
