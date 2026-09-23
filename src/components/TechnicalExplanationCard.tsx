import React from 'react';
import { BookOpen, CheckCircle, Lightbulb, Terminal, AlertCircle } from 'lucide-react';
import { QuestionData } from '../data/questionsData';

interface TechnicalExplanationCardProps {
  question: QuestionData;
}

export const TechnicalExplanationCard: React.FC<TechnicalExplanationCardProps> = ({ question }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Comprehensive Technical Answers & Concepts</h3>
          <p className="text-xs text-slate-400">Direct answers to the theoretical & practical questions required</p>
        </div>
      </div>

      {/* Summary */}
      <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
        <strong className="text-blue-400 block mb-1">Executive Summary:</strong>
        {question.explanation.summary}
      </div>

      {/* Key points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {question.explanation.keyPoints.map((point, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/70 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{point.title}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{point.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Question-Specific In-Depth Deep Dives */}
      {renderSpecialDeepDive(question.id)}
    </div>
  );
};

function renderSpecialDeepDive(questionId: number) {
  switch (questionId) {
    case 1:
      return (
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-blue-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            Demonstration of Post Message Selection:
          </h4>
          <p>
            <strong>1. Passing Run:</strong> <code className="text-emerald-400 font-mono">pytest question1/test_app.py</code> returns exit code 0. Jenkins enters the <code className="text-emerald-400 font-mono">post &#123; success &#123; ... &#125; &#125;</code> block and prints:
          </p>
          <div className="bg-slate-950 p-2.5 rounded font-mono text-emerald-300 text-[11px] border border-emerald-900/40">
            SUCCESS: All unit tests passed! Build finished successfully.
          </div>
          <p>
            <strong>2. Broken multiply Run:</strong> When changed to <code className="text-rose-400 font-mono">return a + b</code>, pytest encounters assertion failure and returns exit code 1. Jenkins stops the stages and executes <code className="text-rose-400 font-mono">post &#123; failure &#123; ... &#125; &#125;</code>, printing:
          </p>
          <div className="bg-slate-950 p-2.5 rounded font-mono text-rose-300 text-[11px] border border-rose-900/40">
            FAILURE: Unit tests failed or an error occurred during execution!
          </div>
        </div>
      );

    case 2:
      return (
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            Why Test Count (6) Differs from Test Function Count (2):
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              There are only <strong>2 Python test functions</strong>: <code>test_find_min</code> and <code>test_count_odds</code>.
            </li>
            <li>
              The <code>@pytest.mark.parametrize</code> decorator maps <strong>3 independent input/expected tuples</strong> to each function.
            </li>
            <li>
              Pytest generates an individual test invocation for every parameter set ($2 \times 3 = 6$ test executions).
            </li>
            <li>
              <strong>Proof of Isolation:</strong> When the expected value for case 2 of <code>test_count_odds</code> is changed to <code>99</code>, only <code>test_count_odds[numbers1-99]</code> reports FAILED, while the other 5 test cases pass cleanly!
            </li>
          </ul>
        </div>
      );

    case 3:
      return (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            Outcomes Comparison: "Release" vs "Abort":
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-950 rounded-lg border border-emerald-900/40">
              <span className="font-bold text-emerald-400 block mb-1">Outcome 1: Click "Release"</span>
              <p className="text-slate-300">
                The input step unblocks with affirmative status. Jenkins logs approval by the user, then continues execution to run <code>python app.py</code>. The deployment output is printed to the console, and the pipeline terminates with <strong>SUCCESS</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-rose-900/40">
              <span className="font-bold text-rose-400 block mb-1">Outcome 2: Click "Abort"</span>
              <p className="text-slate-300">
                The input step throws <code>FlowInterruptedException</code>. Jenkins immediately halts execution without running <code>python app.py</code>, prevents rogue deployments, and records the build status as <strong>ABORTED</strong>.
              </p>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-blue-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            Built-in Variables & Linter Behavior:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-amber-400 font-bold block">BUILD_NUMBER</span>
              <span className="text-emerald-400 font-semibold">CHANGES</span>
              <p className="text-slate-400 font-sans text-xs mt-1">Increments by 1 on every build (1 &rarr; 2).</p>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-amber-400 font-bold block">JOB_NAME</span>
              <span className="text-blue-400 font-semibold">STAYS SAME</span>
              <p className="text-slate-400 font-sans text-xs mt-1">Identifies the fixed job definition in Jenkins.</p>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-amber-400 font-bold block">WORKSPACE</span>
              <span className="text-blue-400 font-semibold">STAYS SAME</span>
              <p className="text-slate-400 font-sans text-xs mt-1">Fixed directory path on executor node.</p>
            </div>
          </div>
          <p className="pt-1">
            <strong>Unused Import Failure:</strong> When <code className="text-rose-400 font-mono">import os</code> is added, Flake8 raises <code className="text-rose-400 font-mono">F401 'os' imported but unused</code> and exits with code 1, which fails the Jenkins build.
          </p>
        </div>
      );

    case 5:
      return (
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            Why First Build Does Not Show "Build with Parameters":
          </h4>
          <p>
            In Declarative Pipeline jobs configured with "Pipeline script from SCM", the parameter definitions exist only inside the remote <code className="text-cyan-300">Jenkinsfile</code>. Jenkins cannot know about these parameters until it clones and evaluates the pipeline script for the first time via <strong>"Build Now"</strong>. During Build #1, Jenkins parses the <code className="text-cyan-300">parameters &#123; ... &#125;</code> block and writes them into the job's <code className="text-cyan-300">config.xml</code>.
          </p>
          <p>
            From Build #2 onwards, Jenkins displays the <strong>"Build with Parameters"</strong> GUI menu with dropdowns and checkboxes.
          </p>
        </div>
      );

    case 6:
      return (
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            Timing Comparison & Artifact Persistence:
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong>Sequential Duration:</strong> 4.0s (frontend) + 4.0s (backend) = <strong>~8.0s</strong> total.
            </li>
            <li>
              <strong>Parallel Duration:</strong> max(4.0s, 4.0s) = <strong>~4.15s</strong> (~50% wall-clock time reduction).
            </li>
            <li>
              <strong>Older Artifact Persistence:</strong> Jenkins archives artifacts per-build under <code>$JENKINS_HOME/jobs/&lt;job&gt;/builds/&lt;build_id&gt;/archive/</code>. When Build #2 finishes, Build #1's <code>frontend_report.txt</code> and <code>backend_report.txt</code> remain permanently available and can be inspected or downloaded at any time.
            </li>
          </ul>
        </div>
      );

    case 7:
      return (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30 text-xs text-slate-300 space-y-2">
          <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Milestone Step & Failure Skip Explanation:
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong>Two quick builds:</strong> When Build #2 is triggered shortly after Build #1, both run concurrently. As soon as the newer build (Build #2) passes <code>milestone 1</code>, Jenkins <strong>automatically aborts Build #1</strong> (labeled <code>Milestone 1: superseded by build #2</code>) to ensure an older build does not overwrite newer code.
            </li>
            <li>
              <strong>Does older build send an email?</strong> <strong>NO.</strong> Because Build #1 was aborted at the milestone step, execution terminated immediately and never reached the <code>Send Notification</code> stage.
            </li>
            <li>
              <strong>Syntax Error outcome:</strong> When <code>app.py</code> contains a syntax error, <code>python -m py_compile</code> exits with code 1. The Build stage immediately FAILS. Because stages run sequentially, <code>Send Notification</code> is skipped and no email is sent.
            </li>
          </ul>
        </div>
      );

    default:
      return null;
  }
}
