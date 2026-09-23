import React, { useState } from 'react';
import {
  Download,
  Github,
  FolderTree,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { QUESTIONS, QuestionData } from './data/questionsData';
import { Navbar } from './components/Navbar';
import { FileViewer } from './components/FileViewer';
import { JenkinsPipelineView } from './components/JenkinsPipelineView';
import { TechnicalExplanationCard } from './components/TechnicalExplanationCard';
import { GitHubModal } from './components/GitHubModal';
import { RepoTreeView } from './components/RepoTreeView';
import { downloadSingleQuestionZip, downloadAllQuestionsZip } from './utils/zipExporter';

export default function App() {
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);
  const [isRepoTreeOpen, setIsRepoTreeOpen] = useState<boolean>(false);
  const [downloadingFolder, setDownloadingFolder] = useState<boolean>(false);

  const currentQuestion: QuestionData =
    QUESTIONS.find((q) => q.id === activeQuestionId) || QUESTIONS[0];

  const handleSelectQuestion = (id: number) => {
    setActiveQuestionId(id);
    setActiveFileIndex(0);
  };

  const handleDownloadFolder = async () => {
    try {
      setDownloadingFolder(true);
      await downloadSingleQuestionZip(currentQuestion);
    } finally {
      setDownloadingFolder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenGithubGuide={() => setIsGithubModalOpen(true)}
        onOpenRepoTree={() => setIsRepoTreeOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <GitBranch className="w-3 h-3" />
                <span>GitHub Multi-Folder Ready Repository</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Jenkins Declarative CI/CD Pipeline Suite
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Complete solution for all 7 laboratory questions. Each question is contained in its own isolated folder (<code className="text-amber-300 font-mono">question1/</code> through <code className="text-amber-300 font-mono">question7/</code>) with full source code, tests, Jenkinsfiles, and interactive build outputs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsGithubModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition flex items-center space-x-2 shadow-sm"
              >
                <Github className="w-4 h-4 text-white" />
                <span>Upload to GitHub Guide</span>
              </button>
              <button
                onClick={() => downloadAllQuestionsZip()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download All 7 Folders (.zip)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Selector Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {QUESTIONS.map((q) => {
            const isSelected = q.id === activeQuestionId;
            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q.id)}
                className={`p-3 rounded-xl text-left transition flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/60 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Q{q.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {q.files.length} files
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 line-clamp-1">
                  {q.title.split(':')[1]?.trim() || q.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {q.conceptBadge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Question Prompt & Header */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-md shadow-blue-600/20">
                Q{currentQuestion.id}
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {currentQuestion.title}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="text-blue-400 font-mono font-semibold">
                    Folder: /{currentQuestion.slug}/
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
                    {currentQuestion.conceptBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Folder actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadFolder}
                disabled={downloadingFolder}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition flex items-center space-x-1.5"
                title={`Download ${currentQuestion.slug} as standalone zip`}
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>{downloadingFolder ? 'Zipping...' : `Download ${currentQuestion.slug}.zip`}</span>
              </button>
            </div>
          </div>

          {/* Full Question Text */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-slate-200 block mb-1">
              Assignment Requirement & Tasks:
            </span>
            {currentQuestion.prompt}
          </div>
        </div>

        {/* Dual Column Layout: File Viewer & Jenkins Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Left Column: Repository Files for this Question (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <FileViewer
              files={currentQuestion.files}
              activeFileIndex={activeFileIndex}
              onSelectFile={(idx) => setActiveFileIndex(idx)}
            />
          </div>

          {/* Right Column: Interactive Jenkins Console & Execution (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <JenkinsPipelineView question={currentQuestion} />
          </div>
        </div>

        {/* Technical Answers & In-Depth Conceptual Explanation Card */}
        <TechnicalExplanationCard question={currentQuestion} />

        {/* Quick Question Switcher / Navigation Footer */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Viewing Question:</span>
            <strong className="text-white">
              {currentQuestion.id} of {QUESTIONS.length}
            </strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={activeQuestionId === 1}
              onClick={() => handleSelectQuestion(activeQuestionId - 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              &larr; Previous Question
            </button>
            <button
              disabled={activeQuestionId === QUESTIONS.length}
              onClick={() => handleSelectQuestion(activeQuestionId + 1)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center space-x-1"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Jenkins Pipeline Multi-Folder Repository Suite &bull; Questions 1 through 7
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              GitHub Setup Instructions
            </button>
            <button
              onClick={() => setIsRepoTreeOpen(true)}
              className="hover:text-slate-300 transition"
            >
              File Tree Explorer
            </button>
            <button
              onClick={() => downloadAllQuestionsZip()}
              className="hover:text-blue-400 transition"
            >
              Download Full Repo
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GitHubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
      <RepoTreeView
        isOpen={isRepoTreeOpen}
        onClose={() => setIsRepoTreeOpen(false)}
        onSelectQuestion={handleSelectQuestion}
      />
    </div>
  );
}
