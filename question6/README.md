# Question 6: Parallel Checks & Artifact Archiving

## Contents
- `Jenkinsfile`: Runs `frontend_check.py` and `backend_check.py` inside a `parallel` block, then archives both reports with `archiveArtifacts`.
- `frontend_check.py`: Sleeps 4s and generates `frontend_report.txt`.
- `backend_check.py`: Sleeps 4s and generates `backend_report.txt`.

## Time Estimation: Parallel vs Sequential
- **Sequential (One after another)**: 4s (frontend) + 4s (backend) = **~8 seconds** (+ process overhead).
- **Parallel (Side by side)**: max(4s, 4s) = **~4 seconds** (+ minimal thread scheduling overhead).
- **Time Saved**: Approximately **50%** reduction in execution time for this stage.

## Older Build's Artifacts Availability
Artifacts are stored on the Jenkins master in per-build folders:
`$JENKINS_HOME/jobs/<job-name>/builds/<build-number>/archive/`
When a newer build runs (e.g. Build 2), it creates its own archive directory. Build 1's artifacts remain intact and accessible via the Build 1 permalink URL (`/job/<job-name>/1/artifact/`) as long as the build is retained by job history.
