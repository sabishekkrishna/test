# Question 3: Manual Approval Input Step & Compilation Check

## Contents
- `Jenkinsfile`: Defines `APP_NAME` and `APP_VERSION` in `environment` block, executes `py_compile` build check, and pauses for manual approval with an OK button labelled `"Release"`.
- `app.py`: Executable application.

## Outcome Comparison
1. **Clicking "Release"**:
   - The operator approves the deployment.
   - The pipeline unpauses and proceeds to execute `python question3/app.py`.
   - Result: Stage completes successfully; overall build status is **SUCCESS**.
2. **Clicking "Abort"**:
   - The operator rejects the deployment.
   - Jenkins interrupts the pipeline step (`FlowInterruptedException`).
   - The subsequent command `python question3/app.py` is **never executed**.
   - Result: Build terminates immediately with status **ABORTED**.
