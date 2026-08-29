import React, { useState } from 'react';
import { Plus, Users, X, UserPlus, Trash2, BookOpen } from 'lucide-react';
import { createClass } from '../services/api';

export default function ClassSelector({ classes = [], selectedClassId, onSelectClass, onClassCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classNameInput, setClassNameInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [students, setStudents] = useState([{ name: '', email: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddStudentRow = () => {
    setStudents([...students, { name: '', email: '' }]);
  };

  const handleRemoveStudentRow = (index) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

  const handleStudentChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!classNameInput.trim() || !subjectInput.trim()) {
      setError('Class name and Subject are required.');
      return;
    }

    // Filter valid students
    const validStudents = students.filter((s) => s.name.trim() && s.email.trim());

    setLoading(true);
    setError('');

    try {
      const newClass = await createClass({
        className: classNameInput.trim(),
        subject: subjectInput.trim(),
        students: validStudents,
      });

      if (onClassCreated) {
        onClassCreated(newClass);
      }
      onSelectClass(newClass._id);

      // Reset form
      setClassNameInput('');
      setSubjectInput('');
      setStudents([{ name: '', email: '' }]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed creating class:', err);
      setError(err.response?.data?.error || 'Failed to create class.');
    } finally {
      setLoading(false);
    }
  };

  const currentSelectedClass = classes.find((c) => c._id === selectedClassId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Target Class & Roster
          </label>
          <div className="relative">
            <select
              value={selectedClassId || ''}
              onChange={(e) => onSelectClass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none cursor-pointer"
            >
              <option value="" disabled>
                -- Select a Class --
              </option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} ({cls.subject}) - {cls.students?.length || 0} Students
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="sm:self-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition shadow-md shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Class</span>
          </button>
        </div>
      </div>

      {currentSelectedClass && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {currentSelectedClass.students?.length || 0} student(s) enrolled in {currentSelectedClass.subject}
            </span>
          </span>
          <span className="font-mono text-slate-500">ID: {currentSelectedClass._id.slice(-6)}</span>
        </div>
      )}

      {/* "+ New Class" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-slate-100 text-lg">Create New Class</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateClass} className="p-5 overflow-y-auto space-y-4">
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS101 - Section A"
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Structures"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Student Roster Section */}
              <div className="border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Student Roster
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStudentRow}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Add Row
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {students.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={student.name}
                        onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="email"
                        placeholder="student@example.com"
                        value={student.email}
                        onChange={(e) => handleStudentChange(idx, 'email', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      {students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStudentRow(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Save & Select Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
