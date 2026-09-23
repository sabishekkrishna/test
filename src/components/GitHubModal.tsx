import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, FolderPlus, GitBranch, ExternalLink, ShieldCheck } from 'lucide-react';
import { downloadAllQuestionsZip } from '../utils/zipExporter';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const gitCommands = `# 1. Download and extract the repository zip, then navigate to root
cd jenkins-pipeline-lab-repository

# 2. Initialize the Git repository
git init

# 3. Stage all question folders and root documentation
git add .

# 4. Commit all files
git commit -m "Add complete Jenkins Pipeline Lab suite (Questions 1 through 7)"

# 5. Point to your remote GitHub repository
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPOSITORY-NAME>.git

# 6. Push to main branch
git branch -M main
git push -u origin main`;

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">GitHub Upload & Repository Setup Guide</h2>
              <p className="text-xs text-slate-400">
                Organized with separate folders for Questions 1 through 7
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Requirement callout */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-600/30 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-200">Strict Folder Separation Standard</div>
              <div className="text-xs text-blue-300/80 mt-1">
                Per your instructions, each question is kept in an isolated folder (<code className="text-blue-200 font-mono">question1/</code>, <code className="text-blue-200 font-mono">question2/</code>, ..., <code className="text-blue-200 font-mono">question7/</code>) containing its respective <code className="text-blue-200 font-mono">Jenkinsfile</code>, application code, test suites, and documentation.
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <span>Download the Pre-Packaged ZIP</span>
            </div>
            <p className="text-xs text-slate-400 pl-8">
              Click the button below to download the ready-to-commit directory tree with all 7 question folders.
            </p>
            <div className="pl-8 pt-1">
              <button
                onClick={() => downloadAllQuestionsZip()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-2 shadow-md shadow-indigo-600/20"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Download All 7 Question Folders (.zip)</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <span>Push to GitHub via Terminal</span>
            </div>
            <p className="text-xs text-slate-400 pl-8">
              Create a new repository on GitHub (e.g. <code className="text-slate-200 font-mono">jenkins-lab-assignments</code>) and run the following commands in your extracted directory:
            </p>
            <div className="pl-8">
              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
                <button
                  onClick={() => handleCopy(gitCommands, 'all')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition flex items-center space-x-1"
                >
                  {copiedCmd === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'all' ? 'Copied' : 'Copy Commands'}</span>
                </button>
                <pre className="overflow-x-auto whitespace-pre leading-relaxed pr-24">
                  {gitCommands}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              <span>Configuring Jenkins Pipeline Jobs</span>
            </div>
            <div className="pl-8 text-xs text-slate-400 space-y-2">
              <p>For each question, create a Jenkins Pipeline job pointed at this repository:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Go to Jenkins Dashboard &rarr; <strong>New Item</strong> &rarr; Name: <code>question1-job</code> &rarr; <strong>Pipeline</strong>.</li>
                <li>Under <strong>Pipeline</strong> section, select <strong>Pipeline script from SCM</strong>.</li>
                <li>SCM: <strong>Git</strong> &rarr; Repository URL: paste your GitHub repo link.</li>
                <li><strong>Script Path</strong>: enter <code className="text-amber-300 font-bold">question1/Jenkinsfile</code> (or <code className="text-amber-300 font-bold">question2/Jenkinsfile</code>, etc.).</li>
                <li>Click <strong>Save</strong> and trigger your builds!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
