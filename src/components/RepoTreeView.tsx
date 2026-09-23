import React, { useState } from 'react';
import { X, Folder, FolderOpen, FileCode, Download, ExternalLink, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { QUESTIONS, ROOT_README_CONTENT, GITIGNORE_CONTENT, QuestionFile } from '../data/questionsData';
import { downloadSingleFile, downloadSingleQuestionZip, downloadAllQuestionsZip } from '../utils/zipExporter';

interface RepoTreeViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (id: number) => void;
}

export const RepoTreeView: React.FC<RepoTreeViewProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'question1': true,
    'question2': true,
    'question3': true,
    'question4': true,
    'question5': true,
    'question6': true,
    'question7': true,
  });

  const [previewFile, setPreviewFile] = useState<{ name: string; path: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleFolder = (slug: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleCopyPreview = async () => {
    if (!previewFile) return;
    await navigator.clipboard.writeText(previewFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Repository File Tree Explorer</h2>
              <p className="text-xs text-slate-400">
                Inspect all 7 standalone question directories and root files
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => downloadAllQuestionsZip()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All (.zip)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-pane view: File Tree on left, Preview on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Tree */}
          <div className="w-2/5 border-r border-slate-800 overflow-y-auto p-4 bg-slate-950/60 font-mono text-xs">
            {/* Root folder */}
            <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-3">
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>jenkins-lab-repository/</span>
            </div>

            {/* Questions folders */}
            <div className="pl-3 space-y-1.5 border-l border-slate-800 ml-2">
              {QUESTIONS.map((q) => {
                const isExpanded = expandedFolders[q.slug];
                return (
                  <div key={q.id} className="space-y-1">
                    <div className="flex items-center justify-between group">
                      <button
                        onClick={() => toggleFolder(q.slug)}
                        className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition text-left py-1"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <Folder className={`w-3.5 h-3.5 ${isExpanded ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span className="font-semibold text-slate-200">{q.slug}/</span>
                        <span className="text-[10px] text-slate-500">({q.files.length} files)</span>
                      </button>

                      <div className="opacity-0 group-hover:opacity-100 transition flex items-center space-x-1">
                        <button
                          onClick={() => {
                            onSelectQuestion(q.id);
                            onClose();
                          }}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-blue-400 hover:bg-slate-700"
                          title="Open Question view"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => downloadSingleQuestionZip(q)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                          title={`Download ${q.slug}.zip`}
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Files inside this question folder */}
                    {isExpanded && (
                      <div className="pl-5 space-y-1 border-l border-slate-800/80 ml-2">
                        {q.files.map((file) => (
                          <button
                            key={file.path}
                            onClick={() => setPreviewFile(file)}
                            className={`w-full text-left flex items-center space-x-2 py-1 px-2 rounded transition ${
                              previewFile?.path === file.path
                                ? 'bg-blue-600/20 text-blue-300 font-medium'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Root files */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <button
                  onClick={() => setPreviewFile({ name: 'README.md', path: 'README.md', content: ROOT_README_CONTENT })}
                  className={`w-full text-left flex items-center space-x-2 py-1 px-2 rounded transition ${
                    previewFile?.path === 'README.md'
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>README.md (root)</span>
                </button>
                <button
                  onClick={() => setPreviewFile({ name: '.gitignore', path: '.gitignore', content: GITIGNORE_CONTENT })}
                  className={`w-full text-left flex items-center space-x-2 py-1 px-2 rounded transition ${
                    previewFile?.path === '.gitignore'
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>.gitignore</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Code Preview Pane */}
          <div className="w-3/5 flex flex-col bg-slate-950">
            {previewFile ? (
              <>
                <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-xs text-slate-300">
                    <span className="text-slate-500">Preview:</span>
                    <span className="text-blue-400 font-semibold">{previewFile.path}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyPreview}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => downloadSingleFile(previewFile.name, previewFile.content)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed select-text">
                  <pre className="whitespace-pre">{previewFile.content}</pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <FileCode className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-400">Select a file from the repository tree to preview</p>
                <p className="text-xs text-slate-600 mt-1 max-w-sm">
                  Click on any file under Question 1 through Question 7 or the root files to view its contents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
