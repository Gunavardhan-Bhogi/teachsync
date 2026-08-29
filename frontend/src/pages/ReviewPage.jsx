import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2, FileText, BookOpen, HelpCircle, Sparkles, Save } from 'lucide-react';
import TranscriptEditor from '../components/Review/TranscriptEditor';
import SummaryEditor from '../components/Review/SummaryEditor';
import QuizEditor from '../components/Review/QuizEditor';
import { dispatchLecture } from '../services/api';

export default function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // State passed via router
  const { draftData, classId, audioFileName } = location.state || {};

  // Local state for edits
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'transcript' | 'summary' | 'quiz'
  const [transcript, setTranscript] = useState(draftData?.transcript || '');
  const [topic, setTopic] = useState(draftData?.topic || 'Untitled Lecture');
  const [summary, setSummary] = useState(
    draftData?.summary || { keyTakeaways: [], detailedNotes: '' }
  );
  const [assessment, setAssessment] = useState(draftData?.assessment || []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!draftData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">No Draft Data Found</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          It looks like you reached this page directly without selecting or analyzing an audio lecture.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

const handleSaveAndDispatch = async () => {
        setError('');
        setSuccessMsg('');
        setLoading(true);
    
        try {
          const payload = {
            lectureId: draftData.lectureId, 
            classId: classId || draftData.classId,
            topic,
            transcript,
            summary,
            assessment,
            audioFileName: audioFileName || 'lecture-audio.webm',
          };
    
          // We use the dispatchLecture helper function that is already imported at the top of your file!
          const result = await dispatchLecture(payload);
          
          setSuccessMsg(result.message || 'Lecture materials saved and dispatched to students successfully!');
    
          setTimeout(() => {
            navigate('/');
          }, 2500);
        } catch (err) {
          console.error('Failed dispatching lecture:', err);
          const errorMessage = err.response?.data?.error || err.message || 'Check backend logs.';
          setError(`Failed to dispatch lecture materials: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header / Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Draft Review Mode
              </span>
              {audioFileName && (
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  Source: {audioFileName}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Review & Fine-Tune Generated Output
            </h1>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={loading || !!successMsg}
          onClick={handleSaveAndDispatch}
          className="flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition transform active:scale-95 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving & Dispatching...</span>
            </>
          ) : successMsg ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Dispatched!</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Save & Dispatch</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-sm flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm flex items-start gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMsg} Redirecting to dashboard...</div>
        </div>
      )}

      {/* View Filter Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Sections', icon: Sparkles },
          { id: 'transcript', label: 'Transcript', icon: FileText },
          { id: 'summary', label: 'Summary & Notes', icon: BookOpen },
          { id: 'quiz', label: 'Quiz Assessment', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs sm:text-sm rounded-t-xl transition whitespace-nowrap border-t border-x ${
                isActive
                  ? 'bg-slate-900 border-slate-700 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-8">
            <TranscriptEditor transcript={transcript} onChange={setTranscript} />
          </div>
          <div className="lg:col-span-6 space-y-8">
            <SummaryEditor
              topic={topic}
              summary={summary}
              onTopicChange={setTopic}
              onSummaryChange={setSummary}
            />
            <QuizEditor assessment={assessment} onChange={setAssessment} />
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="max-w-4xl mx-auto">
          <TranscriptEditor transcript={transcript} onChange={setTranscript} />
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="max-w-4xl mx-auto">
          <SummaryEditor
            topic={topic}
            summary={summary}
            onTopicChange={setTopic}
            onSummaryChange={setSummary}
          />
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="max-w-4xl mx-auto">
          <QuizEditor assessment={assessment} onChange={setAssessment} />
        </div>
      )}
    </div>
  );
}
