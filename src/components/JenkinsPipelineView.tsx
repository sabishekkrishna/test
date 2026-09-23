import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, AlertTriangle, Clock, Terminal, Copy, Check, ShieldAlert } from 'lucide-react';
import { QuestionData } from '../data/questionsData';

interface JenkinsPipelineViewProps {
  question: QuestionData;
}

export const JenkinsPipelineView: React.FC<JenkinsPipelineViewProps> = ({ question }) => {
  const [selectedOutputIndex, setSelectedOutputIndex] = useState(0);
  const [copiedLog, setCopiedLog] = useState(false);

  const activeOutput = question.consoleOutputs[selectedOutputIndex] || question.consoleOutputs[0];

  const handleCopyLog = async () => {
    await navigator.clipboard.writeText(activeOutput.output);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  // Determine stage names from pipeline script for visualization
  const getStagesForQuestion = () => {
    switch (question.id) {
      case 1:
        return ['Checkout', 'Install Dependencies', 'Run Unit Tests', 'Declarative: Post Actions'];
      case 2:
        return ['Checkout', 'Install Dependencies', 'Run Unit Tests (verbose)'];
      case 3:
        return ['Checkout', 'Build (py_compile)', 'Deploy (input approval)'];
      case 4:
        return ['Checkout', 'Show Build Info', 'Run Linter (flake8)'];
      case 5:
        return ['Checkout', 'Show Parameter', 'Extra Check (when)'];
      case 6:
        return ['Checkout', 'Parallel Checks [Frontend & Backend]', 'Archive Reports'];
      case 7:
        return ['Checkout', 'Build (milestone 1)', 'Send Notification'];
      default:
        return ['Checkout', 'Build', 'Test'];
    }
  };

  const stages = getStagesForQuestion();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Interactive Scenario Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Jenkins Build Simulator & Console
          </span>
        </div>

        {/* Build Run Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {question.consoleOutputs.map((item, idx) => {
            const isSelected = idx === selectedOutputIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedOutputIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-2 border ${
                  isSelected
                    ? item.status === 'SUCCESS'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : item.status === 'ABORTED'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 font-mono">
                  {item.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Pipeline Stage Graph (Jenkins Blue Ocean style) */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center justify-between">
          <span>PIPELINE STAGE EXECUTION FLOW</span>
          <span className="text-[11px] font-mono text-slate-500">
            Build Status: <strong className={
              activeOutput.status === 'SUCCESS' ? 'text-emerald-400' :
              activeOutput.status === 'ABORTED' ? 'text-amber-400' : 'text-rose-400'
            }>{activeOutput.status}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto py-2">
          {stages.map((stageName, idx) => {
            const isLast = idx === stages.length - 1;
            const isFailedStage =
              activeOutput.status === 'FAILURE' &&
              (idx === stages.length - 1 ||
               (question.id === 1 && stageName.includes('Run Unit Tests')) ||
               (question.id === 7 && stageName.includes('Build')));

            const isSkippedStage =
              (question.id === 5 && selectedOutputIndex === 1 && stageName.includes('Extra Check')) ||
              (question.id === 7 && activeOutput.status === 'FAILURE' && stageName.includes('Send Notification')) ||
              (activeOutput.status === 'ABORTED' && stageName.includes('Notification'));

            const isAbortedStage =
              activeOutput.status === 'ABORTED' &&
              (stageName.includes('Deploy') || stageName.includes('milestone'));

            return (
              <React.Fragment key={stageName}>
                <div
                  className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-mono transition flex items-center space-x-2 ${
                    isFailedStage
                      ? 'bg-rose-950/50 text-rose-300 border-rose-600/50 shadow-sm shadow-rose-900/20'
                      : isSkippedStage
                      ? 'bg-slate-800/40 text-slate-500 border-slate-700/40 border-dashed'
                      : isAbortedStage
                      ? 'bg-amber-950/50 text-amber-300 border-amber-600/50 shadow-sm shadow-amber-900/20'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 shadow-sm shadow-emerald-900/10'
                  }`}
                >
                  {isFailedStage ? (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  ) : isSkippedStage ? (
                    <Clock className="w-4 h-4 text-slate-500" />
                  ) : isAbortedStage ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-200">{stageName}</div>
                    <div className="text-[10px] text-slate-400">
                      {isSkippedStage ? 'SKIPPED' : isFailedStage ? 'FAILED' : isAbortedStage ? 'ABORTED' : 'PASSED'}
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="w-6 h-0.5 bg-slate-700 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Scenario Explanation Banner */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
        <div className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
          <Terminal className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-white mr-1.5">{activeOutput.badge}:</span>
          <span className="text-slate-300">{activeOutput.explanation}</span>
        </div>
        <button
          onClick={handleCopyLog}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center space-x-1 flex-shrink-0"
        >
          {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLog ? 'Copied' : 'Copy Log'}</span>
        </button>
      </div>

      {/* Console Output Screen */}
      <div className="p-4 bg-slate-950 font-mono text-xs overflow-auto max-h-[420px] select-text">
        <pre className="text-slate-300 whitespace-pre leading-relaxed">
          {formatConsoleLines(activeOutput.output)}
        </pre>
      </div>
    </div>
  );
};

// Formats terminal output colors for Jenkins logs
function formatConsoleLines(output: string): React.ReactNode {
  const lines = output.split('\n');
  return lines.map((line, i) => {
    let className = 'text-slate-300';
    if (line.includes('SUCCESS') || line.includes('PASSED') || line.includes('Passed Milestone')) {
      className = 'text-emerald-400 font-medium';
    } else if (line.includes('FAILURE') || line.includes('FAILED') || line.includes('ERROR:')) {
      className = 'text-rose-400 font-bold';
    } else if (line.includes('ABORTED') || line.includes('superseded by build')) {
      className = 'text-amber-400 font-bold';
    } else if (line.startsWith('[Pipeline] stage') || line.startsWith('[Pipeline] {')) {
      className = 'text-blue-400 font-semibold';
    } else if (line.startsWith('[Pipeline] echo') || line.startsWith('C:\\') || line.startsWith('+ ')) {
      className = 'text-cyan-300/80';
    } else if (line.startsWith('================')) {
      className = 'text-indigo-400/80';
    }

    return (
      <div key={i} className={className}>
        {line || ' '}
      </div>
    );
  });
}
