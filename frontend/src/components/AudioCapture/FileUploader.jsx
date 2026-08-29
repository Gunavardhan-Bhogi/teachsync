import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, X, CheckCircle2 } from 'lucide-react';

export default function FileUploader({ onFileSelected, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['.mp3', '.wav', '.m4a', '.webm'];
  const allowedMimePrefixes = ['audio/'];

  const validateAndSelectFile = (file) => {
    setError('');
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExtensionValid = allowedTypes.some((ext) => fileName.endsWith(ext));

    if (!isExtensionValid && !allowedMimePrefixes.some((mime) => file.type.startsWith(mime))) {
      setError(`Unsupported file type. Please upload ${allowedTypes.join(', ')} files.`);
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".mp3,.wav,.m4a,.webm,audio/*"
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-950/80'
          }`}
        >
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-medium text-slate-200 mb-1">
            Drag & drop lecture audio file here
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            or <span className="text-indigo-400 underline underline-offset-2">browse files</span> from your computer
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700/60 font-mono">.MP3</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700/60 font-mono">.WAV</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700/60 font-mono">.M4A</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700/60 font-mono">.WEBM</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shrink-0">
              <FileAudio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </h4>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type || 'audio file'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onFileSelected(null)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-rose-400 text-center">{error}</p>}
    </div>
  );
}
