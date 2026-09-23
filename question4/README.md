# Question 4: Build Info Metadata & Flake8 Linter Check

## Contents
- `Jenkinsfile`: Pipeline printing `BUILD_NUMBER`, `JOB_NAME`, `WORKSPACE`, and running `flake8`.
- `app.py`: Contains `greet(name)` function.
- `requirements.txt`: Contains `flake8`.

## Variable Comparison Across Two Builds
| Variable | Build 1 | Build 2 | Behavior | Reason |
| :--- | :--- | :--- | :--- | :--- |
| `BUILD_NUMBER` | `1` | `2` | **Changes** | Automatically increments on every new build execution. |
| `JOB_NAME` | `question4-job` | `question4-job` | **Stays Same** | Identifies the project job name in Jenkins. |
| `WORKSPACE` | `/var/jenkins/workspace/question4-job` | `/var/jenkins/workspace/question4-job` | **Stays Same** | Fixed directory path allocated for the job's executor. |

## Linter Failure Demonstration
When an unused import is added to `app.py` (e.g. `import os`):
```text
question4/app.py:5:1: F401 'os' imported but unused
ERROR: script returned exit code 1
Finished: FAILURE
```
Flake8 detects the PEP 8 violation and exits with a non-zero code, failing the build.
