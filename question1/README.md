# Question 1: Windows Agent Pipeline with Post Conditions

## Contents
- `Jenkinsfile`: Pipeline on Windows agent with `bat` steps and success/failure `post` blocks.
- `app.py`: Contains `multiply(a, b)` and `divide(a, b)`.
- `test_app.py`: Unit tests for `multiply` and `divide`.
- `requirements.txt`: Contains `pytest`.

## Pipeline Execution Details
1. **Passing Build**:
   - `multiply(a, b)` returns `a * b`. Pytest exits with 0.
   - Post block executed:
     ```
     Build Succeeded: All unit tests passed!
     ```
2. **Failing Build (Broken multiply)**:
   - Change `multiply(a, b)` to return `a + b`.
   - Pytest fails with `AssertionError: assert 7 == 12`.
   - Post block executed:
     ```
     Build Failed: Unit tests failed or an error occurred!
     ```
