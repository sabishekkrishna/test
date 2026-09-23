import React from 'react';
import { Download, Github, FolderTree, CheckCircle2, Terminal } from 'lucide-react';
import { downloadAllQuestionsZip } from '../utils/zipExporter';

interface NavbarProps {
  onOpenGithubGuide: () => void;
  onOpenRepoTree: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGithubGuide, onOpenRepoTree }) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadAll = async () => {
    try {
      setDownloading(true);
      await downloadAllQuestionsZip();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">
                Jenkins Pipeline Lab Suite
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 7/7 Solved
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-Folder GitHub Repository & Declarative CI/CD Execution Suite
            </p>
          </div>
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenRepoTree}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition flex items-center gap-1.5 shadow-sm"
            title="Inspect full repository structure"
          >
            <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Browse</span> Repo Tree
          </button>

          <button
            onClick={onOpenGithubGuide}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition flex items-center gap-1.5 shadow-sm"
          >
            <Github className="w-3.5 h-3.5 text-slate-300" />
            GitHub Guide
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={downloading}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Packing ZIP...' : 'Download Full Repo (.zip)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
