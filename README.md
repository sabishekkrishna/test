# Jenkins Pipeline Lab Assignments Repository

This repository contains the specific programming files and Jenkins pipeline scripts for all 7 questions, organized into separate folders ready to push directly into Git.

## Repository Folder Structure

```text
.
├── question1/        # Windows agent, bat steps, pytest & post success/failure blocks
│   ├── Jenkinsfile
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── question2/        # Verbose parametrized testing (@pytest.mark.parametrize)
│   ├── Jenkinsfile
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── question3/        # py_compile check, custom env vars, and Release/Abort input gate
│   ├── Jenkinsfile
│   ├── app.py
│   └── README.md
├── question4/        # Jenkins built-in env vars & Flake8 linter check (F401 violation)
│   ├── Jenkinsfile
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
├── question5/        # Parameterized pipeline (choice & booleanParam) with when directive
│   ├── Jenkinsfile
│   ├── app.py
│   └── README.md
├── question6/        # Concurrent parallel checks (4s sleep) & archiveArtifacts
│   ├── Jenkinsfile
│   ├── frontend_check.py
│   ├── backend_check.py
│   └── README.md
├── question7/        # Concurrency control with milestone(1) & notification delivery
│   ├── Jenkinsfile
│   ├── app.py
│   └── README.md
├── .gitignore
└── README.md
```

## Push to GitHub Instructions

```bash
# 1. Initialize git
git init

# 2. Stage all question folders
git add .

# 3. Commit files
git commit -m "Add question1 through question7 folders with pipeline scripts and code"

# 4. Add your GitHub repository remote
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```
