import JSZip from 'jszip';
import { QUESTIONS, ROOT_README_CONTENT, GITIGNORE_CONTENT, QuestionData } from '../data/questionsData';

export async function downloadAllQuestionsZip(): Promise<void> {
  const zip = new JSZip();

  // Root files
  zip.file('README.md', ROOT_README_CONTENT);
  zip.file('.gitignore', GITIGNORE_CONTENT);

  // Each question folder
  QUESTIONS.forEach((q) => {
    const folder = zip.folder(q.slug);
    if (folder) {
      q.files.forEach((file) => {
        folder.file(file.name, file.content);
      });
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(content, 'jenkins-pipeline-lab-repository.zip');
}

export async function downloadSingleQuestionZip(question: QuestionData): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(question.slug);
  if (folder) {
    question.files.forEach((file) => {
      folder.file(file.name, file.content);
    });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(content, `${question.slug}-jenkins-suite.zip`);
}

export function downloadSingleFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
