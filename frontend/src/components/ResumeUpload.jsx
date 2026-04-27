import React, { useState, useCallback } from 'react';
import { Upload, File, X, FileText, Loader2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function ResumeUpload({ onParse, isParsing }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    if (droppedFiles.length) {
      setFiles(prev => [...prev, ...droppedFiles.map(f => ({
        file: f,
        id: Math.random().toString(36).substr(2, 9),
        progress: 100
      }))]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file =>
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    if (selectedFiles.length) {
      setFiles(prev => [...prev, ...selectedFiles.map(f => ({
        file: f,
        id: Math.random().toString(36).substr(2, 9),
        progress: 100
      }))]);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleParse = async () => {
    if (!files.length) return;
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);
    await onParse(files.map(f => f.file));
    clearInterval(interval);
    setUploadProgress(100);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Resume</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Upload candidate resumes for parsing</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${dragActive ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Upload className={`w-7 h-7 ${dragActive ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your resume here, or <span className="text-primary-600">browse</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Supports PDF, DOCX up to 10MB
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map(fileObj => (
              <div key={fileObj.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{fileObj.file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(fileObj.file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parse Button */}
      {files.length > 0 && (
        <div className="space-y-4">
          {isParsing && <ProgressBar progress={uploadProgress} label="Parsing resumes..." />}
          <button
            onClick={handleParse}
            disabled={isParsing}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <File className="w-4 h-4" />
                Parse Resume
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

