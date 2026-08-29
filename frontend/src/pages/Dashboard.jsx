import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mic, Upload, AlertCircle, Loader2 } from 'lucide-react';
import ClassSelector from '../components/ClassSelector';
import LiveRecorder from '../components/AudioCapture/LiveRecorder';
import FileUploader from '../components/AudioCapture/FileUploader';
import MultiFormatSelector from '../components/QuizConfig/MultiFormatSelector';
import { getClasses, generateDraft } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [captureMode, setCaptureMode] = useState('upload'); // 'upload' | 'live'
  const [audioFile, setAudioFile] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState(['mcq', 'fill_in_blanks', 'short_answer']);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
      if (data && data.length > 0) {
        setSelectedClassId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      setError('Could not load classes. Please ensure backend server is running.');
    }
  };

  const handleClassCreated = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
    setSelectedClassId(newClass._id);
  };

  const handleAnalyzeLecture = async () => {
    setError('');

    if (!selectedClassId) {
      setError('Please select or create a target class.');
      return;
    }

    if (!audioFile) {
      setError('Please record or upload a lecture audio file first.');
      return;
    }

    if (selectedFormats.length === 0) {
      setError('Please select at least one question format for the quiz.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('classId', selectedClassId);
      formData.append('quizFormats', JSON.stringify(selectedFormats));
      formData.append('totalQuestions', totalQuestions);

      const draftResult = await generateDraft(formData);

      navigate('/review', {
        state: {
          draftData: draftResult,
          classId: selectedClassId,
          audioFileName: audioFile.name,
        },
      });
    } catch (err) {
      console.error('Error generating draft:', err);
      setError(
        err.response?.data?.error || 'Failed to process lecture audio and generate draft. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Classroom Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Transform Lecture Audio into Smart Classroom Assets
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
            Upload or record classroom audio to automatically transcribe, synthesize detailed structured notes, and generate multi-format student assessments in seconds.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-sm flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Top Section: Target Class & Audio Input */}
        <div className="lg:col-span-7 space-y-6">
          {/* Class Selector */}
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            onClassCreated={handleClassCreated}
          />

          {/* Audio Input Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-200">
                Lecture Audio Source
              </label>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCaptureMode('upload');
                    setAudioFile(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    captureMode === 'upload'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCaptureMode('live');
                    setAudioFile(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    captureMode === 'live'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Live Record
                </button>
              </div>
            </div>

            {captureMode === 'upload' ? (
              <FileUploader
                onFileSelected={(file) => setAudioFile(file)}
                selectedFile={audioFile}
              />
            ) : (
              <LiveRecorder
                onAudioRecorded={(file) => setAudioFile(file)}
                audioFile={audioFile}
              />
            )}
          </div>
        </div>

        {/* Right / Bottom Section: Assessment Config & CTA */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <MultiFormatSelector
            selectedFormats={selectedFormats}
            onFormatsChange={setSelectedFormats}
            totalQuestions={totalQuestions}
            onTotalQuestionsChange={setTotalQuestions}
          />

          {/* Prominent CTA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <button
              type="button"
              disabled={loading || !audioFile || !selectedClassId}
              onClick={handleAnalyzeLecture}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base rounded-xl shadow-xl shadow-indigo-600/30 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing & Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Analyze Lecture & Generate Draft</span>
                </>
              )}
            </button>
            <p className="text-xs text-slate-400">
              Uses Gemini 2.5 Flash for audio transcription, markdown note extraction, and quiz creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
