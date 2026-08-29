import React from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuizEditor({ assessment = [], onChange }) {
  const questions = assessment;

  const handleQuestionChange = (index, updatedField, value) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      [updatedField]: value,
    };
    onChange(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    const currentOptions = [...(updated[qIndex].options || [])];
    currentOptions[optIndex] = value;
    updated[qIndex] = {
      ...updated[qIndex],
      options: currentOptions,
    };
    onChange(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    const currentOptions = [...(updated[qIndex].options || [])];
    currentOptions.push(`Option ${currentOptions.length + 1}`);
    updated[qIndex] = {
      ...updated[qIndex],
      options: currentOptions,
    };
    onChange(updated);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const updated = [...questions];
    const currentOptions = (updated[qIndex].options || []).filter((_, i) => i !== optIndex);
    updated[qIndex] = {
      ...updated[qIndex],
      options: currentOptions,
    };
    onChange(updated);
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: `q_${Date.now()}`,
      format: 'mcq',
      question: 'New question prompt...',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 1',
      explanation: 'Explanation for why this is correct.',
    };
    onChange([...questions, newQ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getFormatBadge = (format) => {
    switch (format) {
      case 'mcq':
        return { label: 'Multiple Choice', style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' };
      case 'fill_in_blanks':
        return { label: 'Fill in Blanks', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'short_answer':
        return { label: 'Short Answer', style: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: format || 'Question', style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-bold text-slate-100 text-lg">Generated Assessment Quiz</h3>
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-950/40 rounded-xl border border-slate-800">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No assessment questions generated yet.</p>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-3 text-xs text-indigo-400 underline font-medium"
          >
            Add your first question
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const badge = getFormatBadge(q.format);
            const isMcq = q.format === 'mcq';

            return (
              <div
                key={q.id || idx}
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-inner relative group"
              >
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      Q{idx + 1}.
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badge.style}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={q.format || 'mcq'}
                      onChange={(e) => handleQuestionChange(idx, 'format', e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="fill_in_blanks">Fill in Blanks</option>
                      <option value="short_answer">Short Answer</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-900 transition"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Question Prompt
                  </label>
                  <input
                    type="text"
                    value={q.question || ''}
                    onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* MCQ Options */}
                {isMcq && (
                  <div className="mb-4 pl-3 border-l-2 border-indigo-500/30 space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Options & Select Correct Answer
                    </label>
                    {(q.options || []).map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${q.id || idx}`}
                          checked={q.correctAnswer === opt}
                          onChange={() => handleQuestionChange(idx, 'correctAnswer', opt)}
                          className="w-3.5 h-3.5 text-indigo-600 bg-slate-900 border-slate-700"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {(q.options || []).length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx, optIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(idx)}
                      className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-1 font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  </div>
                )}

                {/* Non-MCQ Correct Answer Input */}
                {!isMcq && (
                  <div className="mb-4">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Expected Answer / Answer Key
                    </label>
                    <input
                      type="text"
                      value={q.correctAnswer || ''}
                      onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                      placeholder="e.g. Exact phrase or keywords"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Explanation
                  </label>
                  <textarea
                    value={q.explanation || ''}
                    onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                    rows={2}
                    placeholder="Provide reasoning for the correct answer..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
