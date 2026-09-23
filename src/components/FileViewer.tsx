import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, GitCompare, Info } from 'lucide-react';
import { QuestionFile } from '../data/questionsData';
import { downloadSingleFile } from '../utils/zipExporter';

interface FileViewerProps {
  files: QuestionFile[];
  activeFileIndex: number;
  onSelectFile: (index: number) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  files,
  activeFileIndex,
  onSelectFile,
}) => {
  const [copied, setCopied] = useState(false);
  const [showVariant, setShowVariant] = useState(false);

  const currentFile = files[activeFileIndex] || files[0];
  const hasVariant = !!currentFile.variantContent;
  const contentToDisplay = showVariant && currentFile.variantContent
    ? currentFile.variantContent.content
    : currentFile.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSingleFile(currentFile.name, contentToDisplay);
  };

  const lines = contentToDisplay.split('\n');

  // Reset variant toggle when file changes
  const handleSelectTab = (idx: number) => {
    setShowVariant(false);
    onSelectFile(idx);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Tab bar header */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center space-x-1.5 min-w-max">
          {files.map((file, idx) => {
            const isActive = idx === activeFileIndex;
            return (
              <button
                key={file.path}
                onClick={() => handleSelectTab(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-2 border ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border-blue-500/40 shadow-sm'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* File Actions */}
        <div className="flex items-center space-x-2 min-w-max">
          {hasVariant && (
            <button
              onClick={() => setShowVariant(!showVariant)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center space-x-1.5 transition border ${
                showVariant
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-amber-300'
              }`}
              title="Toggle between clean/passing code and failure variant mentioned in question"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{showVariant ? 'Viewing Buggy Variant' : 'Toggle Buggy Variant'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            title="Copy file contents"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            title={`Download ${currentFile.name}`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File metadata breadcrumb */}
      <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-400 font-mono">
          <span className="text-slate-500">Path:</span>
          <span className="text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            /{currentFile.path}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{lines.length} lines</span>
          <span className="text-slate-600">•</span>
          <span className="uppercase text-[10px] tracking-wider text-slate-400">{currentFile.language}</span>
        </div>

        <div className="text-slate-400 text-xs flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate max-w-md">
            {showVariant && currentFile.variantContent
              ? currentFile.variantContent.description
              : currentFile.description}
          </span>
        </div>
      </div>

      {/* Code contents with line numbers */}
      <div className="flex-1 overflow-auto bg-slate-950 font-mono text-xs p-4 leading-relaxed select-text">
        <div className="min-w-full inline-block">
          {lines.map((line, i) => (
            <div key={i} className="flex hover:bg-slate-900/60 transition group py-0.5">
              <span className="w-10 text-right pr-4 text-slate-600 select-none group-hover:text-slate-400 font-mono text-[11px]">
                {i + 1}
              </span>
              <pre className="text-slate-200 flex-1 whitespace-pre font-mono overflow-visible">
                {formatSyntax(line, currentFile.language)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Lightweight syntax colorizer for Jenkinsfile / Python / Bash
function formatSyntax(line: string, language: string): React.ReactNode {
  if (!line) return ' ';

  // Comments
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Docstrings
  if (line.trim().startsWith('"""') || line.trim().startsWith("'''")) {
    return <span className="text-amber-400/80">{line}</span>;
  }

  // Basic Jenkins keywords
  if (language === 'groovy') {
    const jenkinsKeywords = ['pipeline', 'agent', 'stages', 'stage', 'steps', 'post', 'success', 'failure', 'parallel', 'when', 'environment', 'parameters', 'choice', 'booleanParam', 'input'];
    let formatted = line;
    // Highlight strings
    return <span>{highlightTokens(line, jenkinsKeywords, ['bat', 'sh', 'echo', 'checkout', 'archiveArtifacts', 'milestone', 'mail', 'sleep', 'pytest'])}</span>;
  }

  // Python keywords
  if (language === 'python') {
    const pyKeywords = ['def', 'return', 'import', 'from', 'if', 'else', 'elif', 'with', 'as', 'raise', 'for', 'in', 'assert', 'class', 'try', 'except'];
    return <span>{highlightTokens(line, pyKeywords, ['print', 'sum', 'min', 'max', 'round', 'open', 'len'])}</span>;
  }

  return line;
}

function highlightTokens(line: string, keywords: string[], builtins: string[]): React.ReactNode {
  // Simple token highlight using regex split
  const tokens = line.split(/([a-zA-Z0-9_]+|"[^"]*"|'[^']*'|\/\/.*$|#.*$)/g);

  return tokens.map((token, i) => {
    if (keywords.includes(token)) {
      return <span key={i} className="text-purple-400 font-semibold">{token}</span>;
    }
    if (builtins.includes(token)) {
      return <span key={i} className="text-blue-400 font-semibold">{token}</span>;
    }
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      return <span key={i} className="text-emerald-400">{token}</span>;
    }
    if (token.startsWith('//') || token.startsWith('#')) {
      return <span key={i} className="text-slate-500 italic">{token}</span>;
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      return <span key={i} className="text-amber-400">{token}</span>;
    }
    return token;
  });
}
