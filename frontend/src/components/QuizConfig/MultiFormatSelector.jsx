import React from 'react';
import { CheckSquare, Square, Check } from 'lucide-react';

const FORMAT_OPTIONS = [
  {
    id: 'mcq',
    label: 'Multiple Choice',
    description: '4-option question with single correct answer',
    badge: 'MCQ',
  },
  {
    id: 'fill_in_blanks',
    label: 'Fill in the Blanks',
    description: 'Sentence completion with blank answer key',
    badge: 'FIB',
  },
  {
    id: 'short_answer',
    label: 'Short Answer',
    description: 'Concise conceptual question with model answer',
    badge: 'SA',
  },
];

const QUESTION_COUNT_OPTIONS = [3, 5, 10];

export default function MultiFormatSelector({
  selectedFormats = ['mcq'],
  onFormatsChange,
  totalQuestions = 5,
  onTotalQuestionsChange,
}) {
  const toggleFormat = (formatId) => {
    if (selectedFormats.includes(formatId)) {
      // Keep at least one format selected
      if (selectedFormats.length > 1) {
        onFormatsChange(selectedFormats.filter((id) => id !== formatId));
      }
    } else {
      onFormatsChange([...selectedFormats, formatId]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-200">
            Assessment Question Formats
          </label>
          <span className="text-xs text-slate-400">
            {selectedFormats.length} format{selectedFormats.length !== 1 ? 's' : ''} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FORMAT_OPTIONS.map((format) => {
            const isSelected = selectedFormats.includes(format.id);
            return (
              <div
                key={format.id}
                onClick={() => toggleFormat(format.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between select-none ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-950/30 text-slate-100 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-indigo-300">
                    {format.badge}
                  </span>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1 text-slate-200">{format.label}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{format.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-5">
        <label className="block text-sm font-semibold text-slate-200 mb-3">
          Total Question Count
        </label>
        <div className="flex items-center gap-3">
          {QUESTION_COUNT_OPTIONS.map((count) => {
            const isSelected = totalQuestions === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => onTotalQuestionsChange(count)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {count} Questions
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
