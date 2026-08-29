import React from 'react';
import { BookOpen, Plus, Trash2, ListChecks, FileCode } from 'lucide-react';

export default function SummaryEditor({ topic = '', summary = {}, onTopicChange, onSummaryChange }) {
  const keyTakeaways = summary.keyTakeaways || [];
  const detailedNotes = summary.detailedNotes || '';

  const handleTakeawayChange = (index, value) => {
    const updated = [...keyTakeaways];
    updated[index] = value;
    onSummaryChange({ ...summary, keyTakeaways: updated });
  };

  const handleAddTakeaway = () => {
    onSummaryChange({
      ...summary,
      keyTakeaways: [...keyTakeaways, ''],
    });
  };

  const handleRemoveTakeaway = (index) => {
    const updated = keyTakeaways.filter((_, i) => i !== index);
    onSummaryChange({ ...summary, keyTakeaways: updated });
  };

  const handleNotesChange = (value) => {
    onSummaryChange({ ...summary, detailedNotes: value });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-4">
        <BookOpen className="w-5 h-5" />
        <h3 className="font-bold text-slate-100 text-lg">Lecture Summary & Notes</h3>
      </div>

      {/* Topic Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Lecture Topic / Title
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g. Introduction to Binary Search Trees"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Key Takeaways Bullet List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-indigo-400" />
            Key Takeaways
          </label>
          <button
            type="button"
            onClick={handleAddTakeaway}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 bg-indigo-950/50 rounded-lg border border-indigo-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Bullet
          </button>
        </div>

        <div className="space-y-2">
          {keyTakeaways.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl border border-slate-800">
              No key takeaways added yet. Click "Add Bullet" to add one.
            </p>
          ) : (
            keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 ml-1"></span>
                <input
                  type="text"
                  value={takeaway}
                  onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                  placeholder={`Takeaway point #${idx + 1}`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTakeaway(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                  title="Delete point"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detailed Notes Markdown Textarea */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileCode className="w-4 h-4 text-indigo-400" />
          Detailed Lecture Notes (Markdown Supported)
        </label>
        <textarea
          value={detailedNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={10}
          placeholder="Write comprehensive lecture notes here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
