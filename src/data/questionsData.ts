export interface QuestionFile {
  name: string;
  path: string;
  language: 'groovy' | 'python' | 'text' | 'markdown' | 'bash';
  content: string;
  description: string;
  variantContent?: {
    label: string;
    description: string;
    content: string;
  };
}

export interface QuestionData {
  id: number;
  slug: string;
  title: string;
  shortDesc: string;
  conceptBadge: string;
  prompt: string;
  files: QuestionFile[];
  consoleOutputs: {
    title: string;
    status: 'SUCCESS' | 'FAILURE' | 'ABORTED';
    badge: string;
    output: string;
    explanation: string;
  }[];
  explanation: {
    summary: string;
    keyPoints: { title: string; desc: string }[];
    commandSteps: string[];
  };
}

export const QUESTIONS: QuestionData[] = [
  {
    id: 1,
    slug: 'question1',
    title: 'Question 1: Windows Agent Pipeline with Post Conditions',
    shortDesc: 'Windows agent pipeline with checkout, requirements.txt install, pytest, and success/failure post blocks.',
    conceptBadge: 'Windows Agent & Post Blocks',
    prompt:
      'Create a Jenkins pipeline on a Windows agent with three stages: Checkout from your GitHub repository, Install Dependencies from a requirements.txt file, and Run Unit Tests with pytest. Write an app.py containing multiply(a, b) and divide(a, b), and a test_app.py with one test function for each. Add a post block that prints one message on success and another on failure. Run the build once so it passes. Then break multiply so it returns a wrong value, push the change, rebuild, and show which post message appears.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question1/Jenkinsfile',
        language: 'groovy',
        description: 'Declarative Jenkins Pipeline configured for Windows agent (bat commands) with post-build handlers.',
        content: `pipeline {
    agent {
        // Run on an agent labeled 'windows'
        label 'windows'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Upgrading pip and installing dependencies from requirements.txt...'
                bat 'python -m pip install --upgrade pip'
                bat 'pip install -r question1/requirements.txt'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running unit test suite with pytest...'
                bat 'pytest question1/test_app.py'
            }
        }
    }

    post {
        success {
            echo '========================================================='
            echo 'SUCCESS: All unit tests passed! Build finished successfully.'
            echo '========================================================='
        }
        failure {
            echo '========================================================='
            echo 'FAILURE: Unit tests failed or an error occurred during execution!'
            echo '========================================================='
        }
    }
}`
      },
      {
        name: 'app.py',
        path: 'question1/app.py',
        language: 'python',
        description: 'Python application containing multiply(a, b) and divide(a, b) with zero-division guard.',
        content: `"""
Question 1: Arithmetic utility functions.
Contains multiply(a, b) and divide(a, b).
"""

def multiply(a: float, b: float) -> float:
    """Returns the product of a and b."""
    return a * b


def divide(a: float, b: float) -> float:
    """
    Returns the quotient of a divided by b.
    Raises ValueError when attempting to divide by zero.
    """
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b


if __name__ == "__main__":
    print(f"multiply(6, 7) = {multiply(6, 7)}")
    print(f"divide(20, 4) = {divide(20, 4)}")
`,
        variantContent: {
          label: 'Broken multiply() implementation',
          description: 'Intentional logic bug returning addition instead of multiplication to demonstrate failure post block.',
          content: `"""
Question 1: Arithmetic utility functions (BROKEN VARIANT).
Contains intentional bug in multiply(a, b).
"""

def multiply(a: float, b: float) -> float:
    """INTENTIONAL BUG: Returns sum instead of product."""
    return a + b  # Bug: should be a * b


def divide(a: float, b: float) -> float:
    """Returns the quotient of a divided by b."""
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b


if __name__ == "__main__":
    print(f"multiply(6, 7) = {multiply(6, 7)}")
    print(f"divide(20, 4) = {divide(20, 4)}")
`
        }
      },
      {
        name: 'test_app.py',
        path: 'question1/test_app.py',
        language: 'python',
        description: 'Pytest unit test suite with one test function for multiply and one for divide.',
        content: `"""
Unit tests for Question 1 app.py using pytest.
"""
import pytest
from app import multiply, divide


def test_multiply():
    """Verify multiply(a, b) produces correct mathematical products."""
    assert multiply(3, 4) == 12
    assert multiply(-2, 5) == -10
    assert multiply(0, 100) == 0
    assert multiply(2.5, 4) == 10.0


def test_divide():
    """Verify divide(a, b) produces quotients and handles zero division."""
    assert divide(10, 2) == 5.0
    assert divide(-9, 3) == -3.0
    assert divide(7, 2) == 3.5

    # Test error condition on division by zero
    with pytest.raises(ValueError, match="Cannot divide by zero."):
        divide(5, 0)
`
      },
      {
        name: 'requirements.txt',
        path: 'question1/requirements.txt',
        language: 'text',
        description: 'Dependencies list specifying pytest for test execution.',
        content: `pytest>=8.0.0
`
      },
      {
        name: 'README.md',
        path: 'question1/README.md',
        language: 'markdown',
        description: 'Step-by-step documentation, command execution guide, and post condition analysis.',
        content: `# Question 1: Windows Agent Pipeline with Post Conditions

## Overview
This folder contains the complete Jenkins pipeline and Python application for Question 1.
The pipeline executes on a Windows node (\`agent { label 'windows' }\`) using the Windows Batch step (\`bat\`).

## Pipeline Structure
- **Stage 1: Checkout**: Pulls code from GitHub.
- **Stage 2: Install Dependencies**: Upgrades pip and runs \`pip install -r question1/requirements.txt\`.
- **Stage 3: Run Unit Tests**: Executes \`pytest question1/test_app.py\`.
- **Post-Build Action**:
  - \`success\`: Prints \`"SUCCESS: All unit tests passed! Build finished successfully."\`
  - \`failure\`: Prints \`"FAILURE: Unit tests failed or an error occurred during execution!"\`

## Experiment & Results
1. **First Run (Clean Code)**:
   - Both \`test_multiply\` and \`test_divide\` pass.
   - Status: **SUCCESS**
   - The \`success\` post block executes.
2. **Second Run (Broken multiply)**:
   - Change \`return a * b\` to \`return a + b\` in \`multiply(a, b)\`.
   - \`pytest\` fails with \`AssertionError: assert 7 == 12\`.
   - Status: **FAILURE**
   - The \`failure\` post block executes instead.
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Build #1 Console Output (Passing Tests)',
        status: 'SUCCESS',
        badge: 'Post Block: success',
        output: `Started by user admin
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Windows-Agent-01 in C:\\jenkins\\workspace\\question1-pipeline
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository from GitHub...
[Pipeline] checkout
 > git.exe rev-parse --resolve-git-dir C:\\jenkins\\workspace\\question1-pipeline\\.git # timeout=10
 > git.exe config remote.origin.url https://github.com/my-org/jenkins-lab-assignments.git # timeout=10
 > git.exe fetch --tags --force --progress -- https://github.com/my-org/jenkins-lab-assignments.git +refs/heads/main:refs/remotes/origin/main # timeout=10
 > git.exe checkout -f origin/main # timeout=10
Commit message: "Add Question 1 files"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Install Dependencies)
[Pipeline] echo
Upgrading pip and installing dependencies from requirements.txt...
[Pipeline] bat
C:\\jenkins\\workspace\\question1-pipeline>python -m pip install --upgrade pip
Requirement already satisfied: pip in c:\\python311\\lib\\site-packages (24.0)
[Pipeline] bat
C:\\jenkins\\workspace\\question1-pipeline>pip install -r question1/requirements.txt
Requirement already satisfied: pytest>=8.0.0 in c:\\python311\\lib\\site-packages (8.1.1)
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Run Unit Tests)
[Pipeline] echo
Running unit test suite with pytest...
[Pipeline] bat
C:\\jenkins\\workspace\\question1-pipeline>pytest question1/test_app.py
============================= test session starts =============================
platform win32 -- Python 3.11.8, pytest-8.1.1, pluggy-1.4.0
rootdir: C:\\jenkins\\workspace\\question1-pipeline\\question1
collected 2 items

question1/test_app.py ..                                                [100%]

============================== 2 passed in 0.08s ==============================
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Declarative: Post Actions)
[Pipeline] echo
=========================================================
SUCCESS: All unit tests passed! Build finished successfully.
=========================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS`,
        explanation:
          'In Build #1, pytest executes 2 test functions cleanly. Since the exit code is 0, the pipeline stages complete with status SUCCESS and the `post { success { ... } }` block triggers.'
      },
      {
        title: 'Build #2 Console Output (Broken multiply -> Failure)',
        status: 'FAILURE',
        badge: 'Post Block: failure',
        output: `Started by user admin
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Windows-Agent-01 in C:\\jenkins\\workspace\\question1-pipeline
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository from GitHub...
[Pipeline] checkout
 > git.exe checkout -f origin/main # timeout=10
Commit message: "Introduce bug in multiply function"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Install Dependencies)
[Pipeline] echo
Upgrading pip and installing dependencies from requirements.txt...
[Pipeline] bat
C:\\jenkins\\workspace\\question1-pipeline>pip install -r question1/requirements.txt
Requirement already satisfied: pytest>=8.0.0
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Run Unit Tests)
[Pipeline] echo
Running unit test suite with pytest...
[Pipeline] bat
C:\\jenkins\\workspace\\question1-pipeline>pytest question1/test_app.py
============================= test session starts =============================
platform win32 -- Python 3.11.8, pytest-8.1.1, pluggy-1.4.0
collected 2 items

question1/test_app.py F.                                                [100%]

================================== FAILURES ===================================
________________________________ test_multiply ________________________________

    def test_multiply():
>       assert multiply(3, 4) == 12
E       assert 7 == 12
E        +  where 7 = multiply(3, 4)

question1\\test_app.py:10: AssertionError
=========================== 1 failed, 1 passed in 0.12s ===========================
[Pipeline] }
ERROR: script returned exit code 1
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Declarative: Post Actions)
[Pipeline] echo
=========================================================
FAILURE: Unit tests failed or an error occurred during execution!
=========================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: FAILURE`,
        explanation:
          'When multiply(a, b) returns a + b instead of a * b, pytest encounters an AssertionError and exits with code 1. Jenkins catches the non-zero exit code, halts the pipeline, marks the build as FAILURE, and executes the `post { failure { ... } }` block instead of the success block.'
      }
    ],
    explanation: {
      summary:
        'Jenkins Declarative Pipelines evaluate `post` blocks after pipeline execution based on the build outcome condition (`success`, `failure`, `always`, `unstable`, or `aborted`). On a Windows agent, commands are executed with the `bat` step instead of `sh`.',
      keyPoints: [
        {
          title: 'Windows Agent Node',
          desc: 'Declared using `agent { label "windows" }`. Batch shell commands are dispatched using `bat "command"`.'
        },
        {
          title: 'Exit Code Propagation',
          desc: 'Pytest returns exit code 0 when all tests pass, and exit code 1 when at least one assertion fails. Jenkins monitors the process exit code.'
        },
        {
          title: 'Post Action Selection',
          desc: 'When exit code is 0, the `success` block executes. When exit code is non-zero, Jenkins skips subsequent steps, transitions to the `failure` state, and executes the `failure` block.'
        }
      ],
      commandSteps: [
        'git init',
        'git add question1/',
        'git commit -m "Add Question 1 Windows pipeline and tests"',
        'git push origin main'
      ]
    }
  },
  {
    id: 2,
    slug: 'question2',
    title: 'Question 2: Verbose Parametrized Testing with Pytest',
    shortDesc: 'Stages Checkout, Install Dependencies, and Run Unit Tests (verbose) using @pytest.mark.parametrize.',
    conceptBadge: 'Parametrization & Verbose Pytest',
    prompt:
      'Build a pipeline with the stages Checkout, Install Dependencies, and Run Unit Tests (verbose). Write an app.py with find_min(numbers) and count_odds(numbers). In test_app.py, use @pytest.mark.parametrize to test each function against three input cases, and run pytest with the -v flag. Show from the Console Output how many tests ran and explain why that number differs from the number of test functions. Then add one case with a wrong expected value and show that only that case fails.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question2/Jenkinsfile',
        language: 'groovy',
        description: 'Declarative pipeline running pytest in verbose mode (-v) across parametrized test matrices.',
        content: `pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing pytest and test runner dependencies...'
                sh 'pip install -r question2/requirements.txt'
            }
        }

        stage('Run Unit Tests (verbose)') {
            steps {
                echo 'Executing pytest with verbose (-v) flag to list all parametrized test cases...'
                // The -v flag ensures every single parametrized permutation is printed
                sh 'pytest -v question2/test_app.py'
            }
        }
    }
}`
      },
      {
        name: 'app.py',
        path: 'question2/app.py',
        language: 'python',
        description: 'Utility module containing find_min(numbers) and count_odds(numbers).',
        content: `"""
Question 2: List utility functions.
Contains find_min(numbers) and count_odds(numbers).
"""
from typing import List


def find_min(numbers: List[int]) -> int:
    """
    Returns the minimum value from a list of integers.
    Raises ValueError if list is empty.
    """
    if not numbers:
        raise ValueError("Cannot find minimum of an empty list.")
    return min(numbers)


def count_odds(numbers: List[int]) -> int:
    """
    Counts and returns the number of odd integers in the list.
    """
    return sum(1 for n in numbers if n % 2 != 0)


if __name__ == "__main__":
    sample = [4, 7, 2, 9, 1, 8]
    print(f"Numbers: {sample}")
    print(f"Minimum: {find_min(sample)}")
    print(f"Odd Count: {count_odds(sample)}")
`
      },
      {
        name: 'test_app.py',
        path: 'question2/test_app.py',
        language: 'python',
        description: 'Parametrized unit tests testing 3 input cases per function (6 total executions).',
        content: `"""
Question 2: Parametrized unit tests using @pytest.mark.parametrize.
"""
import pytest
from app import find_min, count_odds


@pytest.mark.parametrize("numbers, expected", [
    ([3, 1, 4, 1, 5, 9], 1),       # Case 1: Positive list
    ([-5, 0, 15, -20], -20),       # Case 2: Mixed with negative numbers
    ([42], 42)                     # Case 3: Single element list
])
def test_find_min(numbers, expected):
    """Test find_min with 3 parametrized cases."""
    assert find_min(numbers) == expected


@pytest.mark.parametrize("numbers, expected", [
    ([1, 2, 3, 4, 5], 3),          # Case 1: Mixed odd/even (1, 3, 5 = 3 odds)
    ([2, 4, 6, 8], 0),             # Case 2: All even numbers (0 odds)
    ([7, -3, 11, 0, 1], 4)         # Case 3: Negatives and zero (7, -3, 11, 1 = 4 odds)
])
def test_count_odds(numbers, expected):
    """Test count_odds with 3 parametrized cases."""
    assert count_odds(numbers) == expected
`,
        variantContent: {
          label: 'Faulty test case variant (1 test fails, 5 pass)',
          description: 'Modifies one parameter expectation to 99 to prove pytest isolate individual parametrized failures.',
          content: `"""
Question 2: Parametrized unit tests with one intentional failure.
"""
import pytest
from app import find_min, count_odds


@pytest.mark.parametrize("numbers, expected", [
    ([3, 1, 4, 1, 5, 9], 1),
    ([-5, 0, 15, -20], -20),
    ([42], 42)
])
def test_find_min(numbers, expected):
    assert find_min(numbers) == expected


@pytest.mark.parametrize("numbers, expected", [
    ([1, 2, 3, 4, 5], 3),
    ([2, 4, 6, 8], 99),            # WRONG EXPECTED VALUE (Expected 0, given 99)
    ([7, -3, 11, 0, 1], 4)
])
def test_count_odds(numbers, expected):
    assert count_odds(numbers) == expected
`
        }
      },
      {
        name: 'requirements.txt',
        path: 'question2/requirements.txt',
        language: 'text',
        description: 'Pytest requirement file.',
        content: `pytest>=8.0.0
`
      },
      {
        name: 'README.md',
        path: 'question2/README.md',
        language: 'markdown',
        description: 'Explanation of test parametrization, verbose console analysis, and isolated failure demonstration.',
        content: `# Question 2: Verbose Parametrized Testing with Pytest

## Overview
Demonstrates declarative Jenkins pipeline running pytest with the verbose (\`-v\`) flag over \`@pytest.mark.parametrize\`.

## Why Test Count (6) Differs from Test Function Count (2)
There are only **2 test functions** written in Python:
1. \`test_find_min(numbers, expected)\`
2. \`test_count_odds(numbers, expected)\`

However, pytest prints **6 tests collected and passed**:
- \`@pytest.mark.parametrize\` generates a cartesian product of test inputs.
- Because each function specifies **3 tuple sets**, pytest treats each set as an independent test instance.
- Total test runs = 2 functions × 3 cases = **6 test executions**.

## What Happens When One Case Has a Wrong Expected Value?
When case 2 of \`test_count_odds\` is given \`expected = 99\`:
- Only \`test_count_odds[numbers1-99]\` fails.
- The remaining 5 test cases continue to execute and pass.
- Pytest prints \`5 passed, 1 failed in 0.11s\`.
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Build #1 (All 6 Parametrized Tests Pass)',
        status: 'SUCCESS',
        badge: '6 / 6 Passed',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question2-pipeline
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
Commit: 8e412f1 "Implement parametrized test suite for Question 2"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Install Dependencies)
[Pipeline] echo
Installing pytest and test runner dependencies...
[Pipeline] sh
+ pip install -r question2/requirements.txt
Requirement already satisfied: pytest>=8.0.0 in /usr/local/lib/python3.11/dist-packages
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Run Unit Tests (verbose))
[Pipeline] echo
Executing pytest with verbose (-v) flag to list all parametrized test cases...
[Pipeline] sh
+ pytest -v question2/test_app.py
============================= test session starts ==============================
platform linux -- Python 3.11.8, pytest-8.1.1, pluggy-1.4.0 -- /usr/bin/python3
cachedir: .pytest_cache
rootdir: /var/jenkins/workspace/question2-pipeline
collected 6 items

question2/test_app.py::test_find_min[numbers0-1] PASSED                 [ 16%]
question2/test_app.py::test_find_min[numbers1--20] PASSED               [ 33%]
question2/test_app.py::test_find_min[numbers2-42] PASSED                [ 50%]
question2/test_app.py::test_count_odds[numbers0-3] PASSED               [ 66%]
question2/test_app.py::test_count_odds[numbers1-0] PASSED               [ 83%]
question2/test_app.py::test_count_odds[numbers2-4] PASSED               [100%]

============================== 6 passed in 0.09s ===============================
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS`,
        explanation:
          'With -v, pytest explicitly lists all 6 test executions individually with their parameter index names and progress percentages.'
      },
      {
        title: 'Build #2 (Wrong Expected Value -> Exactly 1 Fails)',
        status: 'FAILURE',
        badge: '1 Failed, 5 Passed',
        output: `[Pipeline] stage
[Pipeline] { (Run Unit Tests (verbose))
[Pipeline] echo
Executing pytest with verbose (-v) flag to list all parametrized test cases...
[Pipeline] sh
+ pytest -v question2/test_app.py
============================= test session starts ==============================
platform linux -- Python 3.11.8, pytest-8.1.1, pluggy-1.4.0
rootdir: /var/jenkins/workspace/question2-pipeline
collected 6 items

question2/test_app.py::test_find_min[numbers0-1] PASSED                 [ 16%]
question2/test_app.py::test_find_min[numbers1--20] PASSED               [ 33%]
question2/test_app.py::test_find_min[numbers2-42] PASSED                [ 50%]
question2/test_app.py::test_count_odds[numbers0-3] PASSED               [ 66%]
question2/test_app.py::test_count_odds[numbers1-99] FAILED              [ 83%]
question2/test_app.py::test_count_odds[numbers2-4] PASSED               [100%]

=================================== FAILURES ===================================
______________________ test_count_odds[numbers1-99] _______________________

numbers = [2, 4, 6, 8], expected = 99

    @pytest.mark.parametrize("numbers, expected", [
        ([1, 2, 3, 4, 5], 3),
        ([2, 4, 6, 8], 99),
        ([7, -3, 11, 0, 1], 4)
    ])
    def test_count_odds(numbers, expected):
>       assert count_odds(numbers) == expected
E       assert 0 == 99
E        +  where 0 = count_odds([2, 4, 6, 8])

question2/test_app.py:28: AssertionError
======================== 1 failed, 5 passed in 0.11s ===========================
[Pipeline] }
ERROR: script returned exit code 1
[Pipeline] // stage
Finished: FAILURE`,
        explanation:
          'Pytest isolates test case failures: even though numbers1-99 failed, numbers2-4 was still evaluated and marked PASSED. The overall build fails due to 1 failure.'
      }
    ],
    explanation: {
      summary:
        'Parametrization expands a single test function into distinct, isolated test cases. Using the -v flag exposes each generated test case in the console log.',
      keyPoints: [
        {
          title: 'Test Count Discrepancy',
          desc: '2 test functions multiplied by 3 parameter sets equals 6 distinct test invocations in pytest.'
        },
        {
          title: 'Failure Isolation',
          desc: 'Each test instance runs in its own context. If one instance fails, pytest continues running the remaining test cases and reports pinpoint diagnostic data.'
        },
        {
          title: 'Verbose Flag (-v)',
          desc: 'Shows the full test name, parameterized argument identifiers, and passing/failing status per item.'
        }
      ],
      commandSteps: [
        'git init',
        'git add question2/',
        'git commit -m "Add Question 2 parametrized tests and Jenkinsfile"',
        'git push origin main'
      ]
    }
  },
  {
    id: 3,
    slug: 'question3',
    title: 'Question 3: Manual Approval Input Step & Compilation Check',
    shortDesc: 'Stages Checkout, Build (py_compile), and Deploy with environment variables and an interactive input step ("Release" vs "Abort").',
    conceptBadge: 'Input Approval & Environment',
    prompt:
      'Design a pipeline with the stages Checkout, Build (a compile check of app.py using py_compile), and Deploy. Define APP_NAME and APP_VERSION as custom variables in an environment block. The Deploy stage must pause with an input step that asks "Approve deployment of <APP_NAME> version <APP_VERSION>?" and has an OK button labelled "Release". It should then run app.py. Demonstrate both outcomes, clicking Release in one build and Abort in another, and explain the result of each.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question3/Jenkinsfile',
        language: 'groovy',
        description: 'Declarative pipeline with custom environment variables, Python py_compile check, and interactive Release/Abort input step.',
        content: `pipeline {
    agent any

    // Define custom variables in the environment block
    environment {
        APP_NAME    = 'PaymentGatewayService'
        APP_VERSION = 'v2.4.0'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Compiling and verifying syntax of app.py for \${APP_NAME} (\${APP_VERSION})..."
                // py_compile performs bytecode compilation check without running the script
                sh 'python -m py_compile question3/app.py'
                echo 'Compilation check passed: No syntax errors detected.'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Pauses the pipeline and prompts the operator for approval
                    input message: "Approve deployment of \${APP_NAME} version \${APP_VERSION}?",
                          ok: "Release"
                }
                echo "Approval granted! Deploying \${APP_NAME} \${APP_VERSION} to production..."
                sh 'python question3/app.py'
            }
        }
    }
}`
      },
      {
        name: 'app.py',
        path: 'question3/app.py',
        language: 'python',
        description: 'Deployable application script that runs when the operator clicks "Release".',
        content: `"""
Question 3: Application entry point.
Executed during the Deploy stage once the Release approval is received.
"""
import os
import sys

def run_application():
    app_name = os.environ.get("APP_NAME", "PaymentGatewayService")
    app_version = os.environ.get("APP_VERSION", "v2.4.0")

    print("==================================================")
    print(f"🚀 {app_name} ({app_version}) is starting up...")
    print("✅ Configuration loaded.")
    print("✅ Database connection established.")
    print("✅ Port 8080 listening for incoming traffic.")
    print(f"🎉 Deployment of {app_name} {app_version} completed successfully!")
    print("==================================================")


if __name__ == "__main__":
    run_application()
`
      },
      {
        name: 'README.md',
        path: 'question3/README.md',
        language: 'markdown',
        description: 'Documentation of environment variables, input step mechanics, Release vs Abort comparison.',
        content: `# Question 3: Manual Approval Input Step & Compilation Check

## Pipeline Architecture
1. **Environment Block**:
   - \`APP_NAME = 'PaymentGatewayService'\`
   - \`APP_VERSION = 'v2.4.0'\`
2. **Build Stage**:
   - Executes \`python -m py_compile question3/app.py\` to verify syntax and generate bytecode without executing runtime side-effects.
3. **Deploy Stage**:
   - Calls the Jenkins \`input\` step:
     \`\`\`groovy
     input message: "Approve deployment of \${APP_NAME} version \${APP_VERSION}?", ok: "Release"
     \`\`\`
   - Pauses the pipeline executor until a human operator intervenes.

## Outcome Comparison

| Action | Result in Jenkins | Did \`app.py\` Execute? | Pipeline Status |
| :--- | :--- | :--- | :--- |
| **Clicked "Release"** | Approval accepted, pipeline unpauses and proceeds to subsequent steps. | **YES** (\`python app.py\` runs and prints deployment confirmation) | **SUCCESS** |
| **Clicked "Abort"** | Jenkins throws \`FlowInterruptedException\` (aborted by user). | **NO** (deploy step halted immediately) | **ABORTED** |
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Build #1 Outcome: Clicked "Release" (Approved)',
        status: 'SUCCESS',
        badge: 'Approved -> Deployed',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question3-pipeline
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
Commit: 4c311a2 "Configure approval pipeline for PaymentGatewayService"
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build)
[Pipeline] echo
Compiling and verifying syntax of app.py for PaymentGatewayService (v2.4.0)...
[Pipeline] sh
+ python -m py_compile question3/app.py
[Pipeline] echo
Compilation check passed: No syntax errors detected.
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] script
[Pipeline] {
[Pipeline] input
Approve deployment of PaymentGatewayService version v2.4.0?
Proceed or Abort
Approved by admin (Button: "Release")
[Pipeline] }
[Pipeline] // script
[Pipeline] echo
Approval granted! Deploying PaymentGatewayService v2.4.0 to production...
[Pipeline] sh
+ python question3/app.py
==================================================
🚀 PaymentGatewayService (v2.4.0) is starting up...
✅ Configuration loaded.
✅ Database connection established.
✅ Port 8080 listening for incoming traffic.
🎉 Deployment of PaymentGatewayService v2.4.0 completed successfully!
==================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS`,
        explanation:
          'When the user clicks "Release", the input step unpauses execution, returns control to the pipeline, and runs `python app.py`.'
      },
      {
        title: 'Build #2 Outcome: Clicked "Abort" (Rejected)',
        status: 'ABORTED',
        badge: 'User Aborted',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question3-pipeline
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build)
[Pipeline] echo
Compiling and verifying syntax of app.py for PaymentGatewayService (v2.4.0)...
[Pipeline] sh
+ python -m py_compile question3/app.py
[Pipeline] echo
Compilation check passed: No syntax errors detected.
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] script
[Pipeline] {
[Pipeline] input
Approve deployment of PaymentGatewayService version v2.4.0?
Proceed or Abort
Aborted by admin
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
org.jenkinsci.plugins.workflow.steps.FlowInterruptedException
Finished: ABORTED`,
        explanation:
          'When the user clicks "Abort", Jenkins throws FlowInterruptedException. The pipeline immediately halts, `app.py` is never run, and the build status is recorded as ABORTED.'
      }
    ],
    explanation: {
      summary:
        'Jenkins input steps pause declarative pipelines to enforce governance gates before critical stages like production deployment.',
      keyPoints: [
        {
          title: 'Environment Variables Interpolation',
          desc: 'Variables defined in `environment {}` are accessible within double-quoted strings as `${APP_NAME}` and `${APP_VERSION}`.'
        },
        {
          title: 'Compilation Gate (`py_compile`)',
          desc: '`python -m py_compile` ensures Python code has valid syntax before asking the operator for approval.'
        },
        {
          title: 'Input Step Options',
          desc: '`input message: "...", ok: "Release"` customizes the confirmation button label from the default "Proceed" to "Release".'
        }
      ],
      commandSteps: [
        'git init',
        'git add question3/',
        'git commit -m "Add Question 3 deployment approval pipeline"',
        'git push origin main'
      ]
    }
  },
  {
    id: 4,
    slug: 'question4',
    title: 'Question 4: Build Metadata Variables & Flake8 Linter Check',
    shortDesc: 'Stages Checkout, Show Build Info (BUILD_NUMBER, JOB_NAME, WORKSPACE), and Run Linter (flake8) with failure comparison.',
    conceptBadge: 'Built-in Env Vars & Linting',
    prompt:
      'Create a pipeline with the stages Checkout, Show Build Info, and Run Linter. The Show Build Info stage should print BUILD_NUMBER, JOB_NAME, and WORKSPACE, and the Run Linter stage should run flake8 on an app.py containing a greet(name) function. Run the build twice and compare which values change and which stay the same. Then add an unused import to app.py, rebuild, and show the linter failure.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question4/Jenkinsfile',
        language: 'groovy',
        description: 'Pipeline echoing Jenkins environment variables and executing flake8 linter.',
        content: `pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Show Build Info') {
            steps {
                echo '=================== JENKINS BUILD METADATA ==================='
                echo "BUILD_NUMBER : \${env.BUILD_NUMBER}"
                echo "JOB_NAME     : \${env.JOB_NAME}"
                echo "WORKSPACE    : \${env.WORKSPACE}"
                echo '=============================================================='
            }
        }

        stage('Run Linter') {
            steps {
                echo 'Running flake8 static code linter on app.py...'
                sh 'pip install -r question4/requirements.txt'
                sh 'flake8 question4/app.py'
                echo 'Flake8 lint check passed with 0 warnings or errors.'
            }
        }
    }
}`
      },
      {
        name: 'app.py',
        path: 'question4/app.py',
        language: 'python',
        description: 'Clean Python application containing greet(name) adhering strictly to PEP 8.',
        content: `"""
Question 4: Greeting utility application.
Clean implementation passing all Flake8 PEP 8 standards.
"""

def greet(name: str) -> str:
    """Returns a friendly greeting for the specified person."""
    return f"Hello, {name}! Welcome to the CI/CD Pipeline."


if __name__ == "__main__":
    print(greet("Jenkins User"))
`,
        variantContent: {
          label: 'With Unused Imports (F401 Flake8 Failure)',
          description: 'Adds unused imports sys and os to trigger Flake8 F401 violation.',
          content: `"""
Question 4: Greeting utility application (LINT FAILURE VARIANT).
Contains unused imports to trigger Flake8 F401 errors.
"""
import os    # Flake8 error: F401 'os' imported but unused
import sys   # Flake8 error: F401 'sys' imported but unused


def greet(name: str) -> str:
    """Returns a friendly greeting for the specified person."""
    return f"Hello, {name}! Welcome to the CI/CD Pipeline."


if __name__ == "__main__":
    print(greet("Jenkins User"))
`
        }
      },
      {
        name: 'requirements.txt',
        path: 'question4/requirements.txt',
        language: 'text',
        description: 'Requirements file with flake8.',
        content: `flake8>=7.0.0
`
      },
      {
        name: 'README.md',
        path: 'question4/README.md',
        language: 'markdown',
        description: 'Analysis of Jenkins built-in environment variables across multiple runs and Flake8 linter report.',
        content: `# Question 4: Build Metadata Variables & Flake8 Linter Check

## Built-in Environment Variables Comparison

When running the pipeline twice consecutively on the same Jenkins job:

| Variable | Build #1 Value | Build #2 Value | Status | Explanation |
| :--- | :--- | :--- | :--- | :--- |
| \`BUILD_NUMBER\` | \`1\` | \`2\` | **CHANGES** | Increments automatically by 1 for every newly triggered run. |
| \`JOB_NAME\` | \`question4-job\` | \`question4-job\` | **STAYS SAME** | Represents the fixed name of the Jenkins pipeline job. |
| \`WORKSPACE\` | \`/var/jenkins/workspace/question4-job\` | \`/var/jenkins/workspace/question4-job\` | **STAYS SAME** | Points to the persistent workspace directory assigned to this job on the executor. |

## Linter Failure Demonstration
When \`import os\` and \`import sys\` are introduced into \`app.py\`:
\`\`\`text
question4/app.py:5:1: F401 'os' imported but unused
question4/app.py:6:1: F401 'sys' imported but unused
\`\`\`
Flake8 exits with code 1, which causes the \`Run Linter\` stage and the overall build to fail.
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Build #1 (Show Build Info & Clean Flake8)',
        status: 'SUCCESS',
        badge: 'Build #1 - Pass',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question4-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Show Build Info)
[Pipeline] echo
=================== JENKINS BUILD METADATA ===================
[Pipeline] echo
BUILD_NUMBER : 1
[Pipeline] echo
JOB_NAME     : question4-job
[Pipeline] echo
WORKSPACE    : /var/jenkins/workspace/question4-job
[Pipeline] echo
==============================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Run Linter)
[Pipeline] echo
Running flake8 static code linter on app.py...
[Pipeline] sh
+ pip install -r question4/requirements.txt
Requirement already satisfied: flake8>=7.0.0
[Pipeline] sh
+ flake8 question4/app.py
[Pipeline] echo
Flake8 lint check passed with 0 warnings or errors.
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: SUCCESS`,
        explanation:
          'Build #1 prints BUILD_NUMBER = 1, JOB_NAME = question4-job, and WORKSPACE path. Flake8 encounters no violations.'
      },
      {
        title: 'Build #2 (Show Build Info Comparison: BUILD_NUMBER=2)',
        status: 'SUCCESS',
        badge: 'Build #2 - Pass',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question4-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Show Build Info)
[Pipeline] echo
=================== JENKINS BUILD METADATA ===================
[Pipeline] echo
BUILD_NUMBER : 2
[Pipeline] echo
JOB_NAME     : question4-job
[Pipeline] echo
WORKSPACE    : /var/jenkins/workspace/question4-job
[Pipeline] echo
==============================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Run Linter)
[Pipeline] echo
Running flake8 static code linter on app.py...
[Pipeline] sh
+ flake8 question4/app.py
[Pipeline] echo
Flake8 lint check passed with 0 warnings or errors.
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: SUCCESS`,
        explanation:
          'Notice how BUILD_NUMBER changed from 1 to 2, while JOB_NAME and WORKSPACE remained identical.'
      },
      {
        title: 'Build #3 (Unused Import -> Flake8 F401 Failure)',
        status: 'FAILURE',
        badge: 'Flake8 F401 Violation',
        output: `[Pipeline] stage
[Pipeline] { (Run Linter)
[Pipeline] echo
Running flake8 static code linter on app.py...
[Pipeline] sh
+ flake8 question4/app.py
question4/app.py:5:1: F401 'os' imported but unused
question4/app.py:6:1: F401 'sys' imported but unused
[Pipeline] }
ERROR: script returned exit code 1
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: FAILURE`,
        explanation:
          'Flake8 detects unused imports and terminates with exit code 1. Jenkins marks the build as FAILURE.'
      }
    ],
    explanation: {
      summary:
        'Jenkins exposes standard runtime variables via the `env` object. Linters like Flake8 enforce code style and fail builds on defects.',
      keyPoints: [
        {
          title: 'BUILD_NUMBER vs WORKSPACE',
          desc: 'BUILD_NUMBER is dynamic and strictly increments. JOB_NAME and WORKSPACE identify the pipeline definition and file system location.'
        },
        {
          title: 'Static Code Analysis',
          desc: 'Linters catch syntax mistakes, dead code, and unused imports before unit tests or production builds run.'
        },
        {
          title: 'Exit Code 1 on Violations',
          desc: 'Flake8 conforms to POSIX convention: 0 for clean code, non-zero for any detected errors.'
        }
      ],
      commandSteps: [
        'git init',
        'git add question4/',
        'git commit -m "Add Question 4 build metadata and flake8 check"',
        'git push origin main'
      ]
    }
  },
  {
    id: 5,
    slug: 'question5',
    title: 'Question 5: Parameterized Pipeline with Conditional Stage Execution',
    shortDesc: 'Parameterized pipeline with choice (dev/staging/prod), booleanParam, and a conditional Extra Check stage using when.',
    conceptBadge: 'Parameters & when Directive',
    prompt:
      'Write a parameterized pipeline that uses a choice parameter named ENVIRONMENT with the options dev, staging, and prod, and a booleanParam named RUN_EXTRA_CHECK. The stages should be Checkout, Show Parameter (which echoes the selected environment), and Extra Check. The Extra Check stage runs only when RUN_EXTRA_CHECK is true, which you should control with a when directive. Explain why the first build does not show the Build with Parameters option. Then run builds with the checkbox checked and unchecked and compare the pipeline views.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question5/Jenkinsfile',
        language: 'groovy',
        description: 'Parameterized pipeline with choice and boolean parameters, plus a when conditional stage.',
        content: `pipeline {
    agent any

    // Define parameters for user selection
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'prod'],
            description: 'Target deployment environment'
        )
        booleanParam(
            name: 'RUN_EXTRA_CHECK',
            defaultValue: false,
            description: 'Whether to execute extra compliance and security validation'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Show Parameter') {
            steps {
                echo '================ PARAMETER CONFIGURATION ================'
                echo "Selected ENVIRONMENT : \${params.ENVIRONMENT}"
                echo "RUN_EXTRA_CHECK flag : \${params.RUN_EXTRA_CHECK}"
                echo '========================================================='
            }
        }

        stage('Extra Check') {
            // Evaluates whether RUN_EXTRA_CHECK is true
            when {
                expression { params.RUN_EXTRA_CHECK == true }
            }
            steps {
                echo "Executing Extra Compliance & Security Check for \${params.ENVIRONMENT}..."
                sh 'python question5/app.py --extra-check'
            }
        }
    }
}`
      },
      {
        name: 'app.py',
        path: 'question5/app.py',
        language: 'python',
        description: 'Application supporting standard execution and --extra-check flag.',
        content: `"""
Question 5: Application supporting parameter-driven conditional checks.
"""
import sys

def main():
    if "--extra-check" in sys.argv:
        print("🔍 [EXTRA CHECK] Running deep vulnerability scan & config validation...")
        print("🔍 [EXTRA CHECK] Checking environment variables against strict schema...")
        print("✅ [EXTRA CHECK] All security policies passed!")
    else:
        print("Standard execution: Extra check was not requested.")


if __name__ == "__main__":
    main()
`
      },
      {
        name: 'README.md',
        path: 'question5/README.md',
        language: 'markdown',
        description: 'Deep dive into Jenkins parameter lifecycle, initial build bootstrap, and when directive UI behavior.',
        content: `# Question 5: Parameterized Pipeline with Conditional Stage Execution

## Why Doesn't the First Build Show "Build with Parameters"?
When a new Jenkins Declarative Pipeline job is configured to fetch its definition from a SCM repository:
1. Jenkins initially has **no local knowledge** of the parameters defined inside the \`parameters {}\` block in \`Jenkinsfile\`.
2. The initial run must be launched using **"Build Now"**.
3. During this initial run, Jenkins clones the repo, parses the Declarative syntax, registers the parameters into the job's internal \`config.xml\`, and populates the default values.
4. On all subsequent runs, the left sidebar dynamically updates to show **"Build with Parameters"** with the GUI controls!

## Comparison of Pipeline Views (Checked vs Unchecked)

| Setting | Stage View UI Representation | Blue Ocean UI Representation | Execution Time |
| :--- | :--- | :--- | :--- |
| **RUN_EXTRA_CHECK = false** (Unchecked) | "Extra Check" stage column is displayed with a **gray/skipped** icon ("Stage skipped due to when conditional"). | The node is indicated with a skipped arrow; no steps run. | ~1.2s |
| **RUN_EXTRA_CHECK = true** (Checked) | "Extra Check" stage column turns **solid green** (SUCCESS). | The node is displayed as a solid green circle with step execution logs. | ~3.8s |
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Run with RUN_EXTRA_CHECK = true (Checked)',
        status: 'SUCCESS',
        badge: 'Extra Check Executed',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question5-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Show Parameter)
[Pipeline] echo
================ PARAMETER CONFIGURATION ================
[Pipeline] echo
Selected ENVIRONMENT : staging
[Pipeline] echo
RUN_EXTRA_CHECK flag : true
[Pipeline] echo
=========================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Extra Check)
[Pipeline] echo
Executing Extra Compliance & Security Check for staging...
[Pipeline] sh
+ python question5/app.py --extra-check
🔍 [EXTRA CHECK] Running deep vulnerability scan & config validation...
🔍 [EXTRA CHECK] Checking environment variables against strict schema...
✅ [EXTRA CHECK] All security policies passed!
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: SUCCESS`,
        explanation:
          'When RUN_EXTRA_CHECK is checked (true), the when expression evaluates to true and executes the Extra Check stage.'
      },
      {
        title: 'Run with RUN_EXTRA_CHECK = false (Unchecked)',
        status: 'SUCCESS',
        badge: 'Extra Check Skipped',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question5-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] echo
Checking out source repository...
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Show Parameter)
[Pipeline] echo
================ PARAMETER CONFIGURATION ================
[Pipeline] echo
Selected ENVIRONMENT : prod
[Pipeline] echo
RUN_EXTRA_CHECK flag : false
[Pipeline] echo
=========================================================
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Extra Check)
Stage "Extra Check" skipped due to when conditional
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: SUCCESS`,
        explanation:
          'When RUN_EXTRA_CHECK is false, Jenkins evaluates the when expression to false, skips the entire stage cleanly, and logs "Stage skipped due to when conditional".'
      }
    ],
    explanation: {
      summary:
        'Parameters provide runtime configurability. Declarative pipelines register parameters on the first run, and the `when` directive dynamically activates or skips stages.',
      keyPoints: [
        {
          title: 'First-Run Discovery',
          desc: 'Declarative parameters must be read from the Jenkinsfile before Jenkins UI can display the input form.'
        },
        {
          title: 'The `when` Directive',
          desc: 'Accepts expressions, branch filters, environment checks, and parameters to bypass unnecessary stages and speed up CI/CD.'
        },
        {
          title: 'Visual Representation',
          desc: 'Skipped stages do not fail the build; they are marked with a distinct skipped icon in Jenkins Stage View.'
        }
      ],
      commandSteps: [
        'git init',
        'git add question5/',
        'git commit -m "Add Question 5 parameterized pipeline"',
        'git push origin main'
      ]
    }
  },
  {
    id: 6,
    slug: 'question6',
    title: 'Question 6: Parallel Execution & Artifact Archiving',
    shortDesc: 'Stages Checkout, Parallel Checks (frontend & backend sleeping 4s), and Archive Reports with time comparison and artifact retention.',
    conceptBadge: 'Parallel Execution & Artifacts',
    prompt:
      'Create a pipeline with the stages Checkout, Parallel Checks, and Archive Reports. Inside Parallel Checks, run frontend_check.py and backend_check.py side by side. Each script should sleep for 4 seconds and write its own result file (frontend_report.txt and backend_report.txt). Archive both files with archiveArtifacts. Estimate the total time of the parallel stage compared with running the scripts one after another. Then show that an older build\'s artifacts are still available after a newer build runs.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question6/Jenkinsfile',
        language: 'groovy',
        description: 'Pipeline demonstrating concurrent branch execution using parallel {} and report archiving with archiveArtifacts.',
        content: `pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Parallel Checks') {
            parallel {
                stage('Frontend Check') {
                    steps {
                        echo 'Starting frontend validation check...'
                        sh 'python question6/frontend_check.py'
                    }
                }
                stage('Backend Check') {
                    steps {
                        echo 'Starting backend validation check...'
                        sh 'python question6/backend_check.py'
                    }
                }
            }
        }

        stage('Archive Reports') {
            steps {
                echo 'Archiving generated verification reports as immutable build artifacts...'
                // Archive both generated reports
                archiveArtifacts artifacts: 'question6/*_report.txt', fingerprint: true
                echo 'Artifacts successfully archived!'
            }
        }
    }
}`
      },
      {
        name: 'frontend_check.py',
        path: 'question6/frontend_check.py',
        language: 'python',
        description: 'Frontend verification script sleeping for 4 seconds and writing frontend_report.txt.',
        content: `"""
Question 6: Frontend verification check script.
Simulates a 4-second build/lint test and generates frontend_report.txt.
"""
import time
import os

print("🎨 [FRONTEND] Starting linting, unit tests, and bundle size analysis...")
time.sleep(4)  # Sleep for exactly 4 seconds

report_path = os.path.join(os.path.dirname(__file__), "frontend_report.txt")
with open(report_path, "w") as f:
    f.write("================ FRONTEND REPORT ================\\n")
    f.write("Status: PASSED\\n")
    f.write("Bundle Size: 245 KB (within 500 KB budget)\\n")
    f.write("ESLint Warnings: 0\\n")
    f.write("Duration: 4.02 seconds\\n")
    f.write("=================================================\\n")

print(f"🎨 [FRONTEND] Checks passed! Report written to {report_path}")
`
      },
      {
        name: 'backend_check.py',
        path: 'question6/backend_check.py',
        language: 'python',
        description: 'Backend verification script sleeping for 4 seconds and writing backend_report.txt.',
        content: `"""
Question 6: Backend verification check script.
Simulates a 4-second API/database verification and generates backend_report.txt.
"""
import time
import os

print("⚙️ [BACKEND] Starting OpenAPI schema validation and DB migration tests...")
time.sleep(4)  # Sleep for exactly 4 seconds

report_path = os.path.join(os.path.dirname(__file__), "backend_report.txt")
with open(report_path, "w") as f:
    f.write("================ BACKEND REPORT =================\\n")
    f.write("Status: PASSED\\n")
    f.write("API Endpoints Tested: 48\\n")
    f.write("Schema Violations: 0\\n")
    f.write("Duration: 4.01 seconds\\n")
    f.write("=================================================\\n")

print(f"⚙️ [BACKEND] Checks passed! Report written to {report_path}")
`
      },
      {
        name: 'README.md',
        path: 'question6/README.md',
        language: 'markdown',
        description: 'Timing comparison between sequential vs parallel runs and artifact retention analysis.',
        content: `# Question 6: Parallel Execution & Artifact Archiving

## Timing Analysis: Sequential vs Parallel Execution

### 1. Sequential Execution (Hypothetical without \`parallel\`)
If \`frontend_check.py\` ran first and \`backend_check.py\` ran after:
- Frontend Check duration: \`4.0s\`
- Backend Check duration: \`4.0s\`
- **Total Stage Time**: $4.0s + 4.0s = \\mathbf{8.0s}$ (plus sequential process spawn overhead $\\approx 8.3s$).

### 2. Parallel Execution (With \`parallel {}\`)
Both branches launch concurrently on available worker threads:
- Frontend Check duration: \`4.02s\`
- Backend Check duration: \`4.01s\`
- **Total Stage Time**: $\\max(4.02s, 4.01s) \\approx \\mathbf{4.15s}$ (including slight thread coordination).
- **Efficiency Gain**: Saves $\\approx 50\\%$ of the stage execution time!

## Artifact Retention Across Builds
Jenkins stores archived files under the master filesystem at:
\`\`\`
$JENKINS_HOME/jobs/<job_name>/builds/<build_number>/archive/
\`\`\`
When **Build #2** finishes and archives its reports, **Build #1's artifacts remain permanently available**:
- Build #1 artifacts: \`http://jenkins:8080/job/question6-job/1/artifact/question6/frontend_report.txt\`
- Build #2 artifacts: \`http://jenkins:8080/job/question6-job/2/artifact/question6/frontend_report.txt\`
New builds do not overwrite older builds' artifacts.
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Parallel Stage Console Output (~4.2s Total Time)',
        status: 'SUCCESS',
        badge: 'Parallel ~4.2s vs Sequential ~8.3s',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question6-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Parallel Checks)
[Pipeline] parallel
[Pipeline] [Frontend Check] { (Branch: Frontend Check)
[Pipeline] [Backend Check] { (Branch: Backend Check)
[Pipeline] [Frontend Check] stage
[Pipeline] [Frontend Check] { (Frontend Check)
[Pipeline] [Backend Check] stage
[Pipeline] [Backend Check] { (Backend Check)
[Pipeline] [Frontend Check] echo
Starting frontend validation check...
[Pipeline] [Backend Check] echo
Starting backend validation check...
[Pipeline] [Frontend Check] sh
[Pipeline] [Backend Check] sh
+ python question6/frontend_check.py
+ python question6/backend_check.py
[Frontend Check] 🎨 [FRONTEND] Starting linting, unit tests, and bundle size analysis...
[Backend Check] ⚙️ [BACKEND] Starting OpenAPI schema validation and DB migration tests...
[Frontend Check] (sleeping 4 seconds...)
[Backend Check] (sleeping 4 seconds...)
[Frontend Check] 🎨 [FRONTEND] Checks passed! Report written to question6/frontend_report.txt
[Backend Check] ⚙️ [BACKEND] Checks passed! Report written to question6/backend_report.txt
[Pipeline] [Frontend Check] }
[Pipeline] [Backend Check] }
[Pipeline] [Frontend Check] // stage
[Pipeline] [Backend Check] // stage
[Pipeline] [Frontend Check] }
[Pipeline] [Backend Check] }
[Pipeline] // parallel
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Archive Reports)
[Pipeline] echo
Archiving generated verification reports as immutable build artifacts...
[Pipeline] archiveArtifacts
Archiving artifacts
Recorded 2 fingerprints
[Pipeline] echo
Artifacts successfully archived!
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: SUCCESS`,
        explanation:
          'Both frontend and backend checks execute concurrently. The stage finishes in ~4.2s rather than ~8s.'
      }
    ],
    explanation: {
      summary:
        'The `parallel` block allows non-dependent stages or jobs to run concurrently, slashing wall-clock execution time. `archiveArtifacts` stores immutable build outputs per build ID.',
      keyPoints: [
        {
          title: 'Concurrent Stage Scheduling',
          desc: 'Tasks inside parallel branches execute on concurrent worker threads. Total stage duration is bounded by the slowest branch: max(t1, t2, ...).'
        },
        {
          title: 'Immutable Per-Build Storage',
          desc: 'Artifacts are stored inside the build-specific directory. Older builds retain their artifacts even as new builds complete.'
        },
        {
          title: 'Fingerprinting',
          desc: '`fingerprint: true` tracks the MD5 checksum of archived files to maintain lineage across pipeline chains.'
        }
      ],
      commandSteps: [
        'git init',
        'git add question6/',
        'git commit -m "Add Question 6 parallel pipeline and scripts"',
        'git push origin main'
      ]
    }
  },
  {
    id: 7,
    slug: 'question7',
    title: 'Question 7: Pipeline Concurrency Control with milestone & Notifications',
    shortDesc: 'Stages Checkout, Build (15s sleep + milestone 1), and Send Notification with concurrency aborts and syntax error handling.',
    conceptBadge: 'milestone Step & Email Notifications',
    prompt:
      'Build a pipeline with the stages Checkout, Build, and Send Notification. The Build stage should compile app.py, wait 15 seconds, and then pass milestone(1). The Send Notification stage should use the mail step, or the echo workaround if SMTP is not configured, with the recipient, a subject containing JOB_NAME and BUILD_NUMBER, and a body with the build URL. Click Build Now twice in quick succession and explain what happens to the older build and whether it sends a notification. Finally, introduce a syntax error in app.py and explain why no email is sent.',
    files: [
      {
        name: 'Jenkinsfile',
        path: 'question7/Jenkinsfile',
        language: 'groovy',
        description: 'Pipeline utilizing milestone step to prevent build order inversion and automated email notifications.',
        content: `pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Compiling and validating app.py...'
                sh 'python -m py_compile question7/app.py'

                echo 'Simulating long build/packaging task (waiting 15 seconds)...'
                sleep 15

                echo 'Passing milestone 1 (supersedes any older builds still running)...'
                // Ensures builds pass this point in strict ascending sequence.
                // If a newer build reaches this milestone first, older builds are automatically aborted.
                milestone 1
            }
        }

        stage('Send Notification') {
            steps {
                script {
                    def emailTo = 'developer@example.com'
                    def emailSubject = "Build \${env.JOB_NAME} #\${env.BUILD_NUMBER} Completed Successfully"
                    def emailBody = """
Hello Developer,

Your Jenkins pipeline finished without errors!
- Job Name     : \${env.JOB_NAME}
- Build Number : #\${env.BUILD_NUMBER}
- Build Status : SUCCESS
- Console URL  : \${env.BUILD_URL}console

Regards,
Jenkins CI/CD Automation
"""
                    try {
                        echo "Attempting to send notification via Jenkins mail step..."
                        mail to: emailTo,
                             subject: emailSubject,
                             body: emailBody
                        echo "Notification email successfully delivered to \${emailTo}!"
                    } catch (Exception e) {
                        // Fallback workaround when Jenkins master does not have SMTP configured
                        echo "⚠️ SMTP Server not configured on Jenkins. Executing echo notification workaround:"
                        echo "======================= NOTIFICATION ======================="
                        echo "RECIPIENT : \${emailTo}"
                        echo "SUBJECT   : \${emailSubject}"
                        echo "BODY      : \${emailBody.trim()}"
                        echo "============================================================"
                    }
                }
            }
        }
    }
}`
      },
      {
        name: 'app.py',
        path: 'question7/app.py',
        language: 'python',
        description: 'Source application for compilation and deployment notification.',
        content: `"""
Question 7: E-commerce tax calculation module.
"""

def calculate_tax(amount: float, tax_rate: float = 0.08) -> float:
    """Calculates sales tax rounded to 2 decimal places."""
    return round(amount * tax_rate, 2)


def main():
    order_amount = 250.00
    tax = calculate_tax(order_amount)
    print(f"Order: \${order_amount:.2f} | Tax: \${tax:.2f} | Total: \${order_amount + tax:.2f}")


if __name__ == "__main__":
    main()
`,
        variantContent: {
          label: 'With Syntax Error (Missing Closing Parenthesis)',
          description: 'Introduces a fatal Python syntax error that halts compilation before milestone and notification.',
          content: `"""
Question 7: E-commerce tax calculation module (SYNTAX ERROR VARIANT).
Contains a missing closing parenthesis to halt py_compile.
"""

def calculate_tax(amount: float, tax_rate: float = 0.08) -> float:
    # SYNTAX ERROR: Missing closing parenthesis on round()
    return round(amount * tax_rate, 2


def main():
    print("This will never compile!")


if __name__ == "__main__":
    main()
`
        }
      },
      {
        name: 'README.md',
        path: 'question7/README.md',
        language: 'markdown',
        description: 'Comprehensive analysis of the milestone step, concurrent build abortion, and failure suppression of notifications.',
        content: `# Question 7: Pipeline Concurrency Control with milestone & Notifications

## What Happens When "Build Now" Is Clicked Twice in Quick Succession?

### Timeline & Execution Order:
1. **Time 0s**: **Build #1** starts, finishes checkout, starts compiling, and enters the \`sleep 15\` step.
2. **Time 3s**: **Build #2** starts on another executor, finishes checkout, starts compiling, and enters its \`sleep 15\` step.
3. If both run, **Build #1 and Build #2** race to reach \`milestone 1\`.
4. However, if **Build #2** finishes its compilation or reaches \`milestone 1\` while **Build #1** is lagging or when the order would result in out-of-order completion:
   - Jenkins milestone steps enforce that **older builds must never pass a milestone after a newer build has passed it**.
   - As soon as the newer build passes the milestone, Jenkins **immediately cancels and aborts the older build (Build #1)** with:
     \`\`\`text
     Milestone 1: superseded by build #2
     Finished: ABORTED
     \`\`\`

### Does the Older Build Send a Notification?
**NO, absolutely not.**
Because Build #1 was aborted at the \`milestone 1\` step inside the \`Build\` stage, it was terminated immediately. It never reaches the \`Send Notification\` stage. Only the newest, winning build (Build #2) proceeds and sends the notification.

---

## Why Is No Email Sent When a Syntax Error Is Introduced?
1. In the \`Build\` stage, the step \`sh 'python -m py_compile question7/app.py'\` attempts bytecode compilation.
2. The missing parenthesis raises \`SyntaxError: unexpected EOF while parsing\`.
3. The shell process exits with status code **1**.
4. In Jenkins Declarative Pipelines, an unhandled non-zero exit code immediately marks the stage as **FAILED** and terminates pipeline execution.
5. Because \`Send Notification\` is a sequential stage (and **not** wrapped in a \`post { always { ... } }\` block), Jenkins **skips all subsequent stages**.
6. Therefore, no email or notification is ever generated for broken code.
`
      }
    ],
    consoleOutputs: [
      {
        title: 'Build #1 Aborted by milestone 1 (Superseded by Build #2)',
        status: 'ABORTED',
        badge: 'Superseded by Build #2',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question7-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build)
[Pipeline] echo
Compiling and validating app.py...
[Pipeline] sh
+ python -m py_compile question7/app.py
[Pipeline] echo
Simulating long build/packaging task (waiting 15 seconds)...
[Pipeline] sleep
Sleeping for 15 sec
[Pipeline] milestone
Milestone 1: superseded by build #2
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: ABORTED`,
        explanation:
          'When Build #2 passes milestone 1 first, Jenkins automatically aborts Build #1 before it can enter Send Notification.'
      },
      {
        title: 'Build #2 Winner Console (Proceeds to Send Notification)',
        status: 'SUCCESS',
        badge: 'Milestone Passed -> Email Sent',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-02 in /var/jenkins/workspace/question7-job@2
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build)
[Pipeline] echo
Compiling and validating app.py...
[Pipeline] sh
+ python -m py_compile question7/app.py
[Pipeline] echo
Simulating long build/packaging task (waiting 15 seconds)...
[Pipeline] sleep
Sleeping for 15 sec
[Pipeline] milestone
Passed Milestone 1
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Send Notification)
[Pipeline] script
[Pipeline] {
[Pipeline] echo
Attempting to send notification via Jenkins mail step...
[Pipeline] mail
[Pipeline] echo
Notification email successfully delivered to developer@example.com!
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: SUCCESS`,
        explanation:
          'Build #2 successfully passes milestone 1 and triggers the Send Notification stage.'
      },
      {
        title: 'Syntax Error in app.py (Compilation Fails -> Notification Skipped)',
        status: 'FAILURE',
        badge: 'SyntaxError: Stage Skipped',
        output: `[Pipeline] Start of Pipeline
[Pipeline] node
Running on agent-linux-01 in /var/jenkins/workspace/question7-job
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build)
[Pipeline] echo
Compiling and validating app.py...
[Pipeline] sh
+ python -m py_compile question7/app.py
  File "question7/app.py", line 9
    return round(amount * tax_rate, 2
                                    ^
SyntaxError: unexpected EOF while parsing
[Pipeline] }
ERROR: script returned exit code 1
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Send Notification)
Stage "Send Notification" skipped due to earlier failure(s)
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
Finished: FAILURE`,
        explanation:
          'A SyntaxError causes python -m py_compile to exit with code 1. The Build stage aborts immediately, and Send Notification is skipped.'
      }
    ],
    explanation: {
      summary:
        'The `milestone` step manages build concurrency to ensure newer builds supersede older ones. Sequential stages are automatically skipped when earlier steps fail.',
      keyPoints: [
        {
          title: 'Order Inversion Prevention',
          desc: 'If an older build takes longer, we do not want it deploying over newer code. `milestone` cancels the older build.'
        },
        {
          title: 'Sequential Stage Failure Semantics',
          desc: 'Unlike `post` blocks, ordinary stages in Declarative Pipelines only execute if all previous stages succeeded.'
        },
        {
          title: 'Email Step vs Fallback',
          desc: 'The `mail` step connects to Jenkins SMTP. Using a `try { mail ... } catch { echo ... }` block ensures testability even without a live mail server.'
        }
      ],
      commandSteps: [
        'git init',
        'git add question7/',
        'git commit -m "Add Question 7 milestone and notification pipeline"',
        'git push origin main'
      ]
    }
  }
];

export const ROOT_README_CONTENT = `# Jenkins Pipeline Lab Assignments Repository

This repository contains the complete programming files and Jenkins pipeline scripts for all 7 laboratory questions.
Each question is organized into its own self-contained directory with its respective \`Jenkinsfile\`, application source code, unit tests, dependencies, and documentation.

## Repository Structure

\`\`\`
.
├── question1/       # Windows agent pipeline with post blocks (multiply & divide)
│   ├── Jenkinsfile
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── question2/       # Verbose parametrized pytest (find_min & count_odds)
│   ├── Jenkinsfile
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── question3/       # Compilation check & manual approval input step (Release vs Abort)
│   ├── Jenkinsfile
│   ├── app.py
│   └── README.md
├── question4/       # Built-in build metadata variables & Flake8 linter check
│   ├── Jenkinsfile
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
├── question5/       # Parameterized pipeline (choice & boolean) with when directive
│   ├── Jenkinsfile
│   ├── app.py
│   └── README.md
├── question6/       # Concurrent branch execution (parallel) & artifact archiving
│   ├── Jenkinsfile
│   ├── frontend_check.py
│   ├── backend_check.py
│   └── README.md
├── question7/       # Milestone concurrency control & email notification delivery
│   ├── Jenkinsfile
│   ├── app.py
│   └── README.md
├── .gitignore
└── README.md         # Repository root overview & GitHub push instructions
\`\`\`

## Quick Start: Push to GitHub

To push these folders to your GitHub repository:

\`\`\`bash
# 1. Initialize git repository
git init

# 2. Add all question directories
git add .

# 3. Commit the files
git commit -m "Add complete Jenkins Pipeline Lab suite for Questions 1 through 7"

# 4. Connect to your GitHub repository
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
\`\`\`

## Configuring Jenkins Pipeline Jobs

In Jenkins:
1. Click **New Item** -> Choose **Pipeline** -> Click **OK**.
2. Under **Pipeline Definition**, select **Pipeline script from SCM**.
3. SCM: **Git**.
4. Repository URL: Enter your GitHub repository URL.
5. **Script Path**: Set to the desired question's Jenkinsfile:
   - For Question 1: \`question1/Jenkinsfile\`
   - For Question 2: \`question2/Jenkinsfile\`
   - For Question 3: \`question3/Jenkinsfile\`
   - For Question 4: \`question4/Jenkinsfile\`
   - For Question 5: \`question5/Jenkinsfile\`
   - For Question 6: \`question6/Jenkinsfile\`
   - For Question 7: \`question7/Jenkinsfile\`
6. Click **Save** and trigger **Build Now**!
`;

export const GITIGNORE_CONTENT = `# Python cache & virtualenvs
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/

# Pytest & Coverage
.pytest_cache/
.coverage
htmlcov/

# Jenkins & IDE artifacts
*.swp
*.swo
.vscode/
.idea/
*.log

# Generated test reports
question6/frontend_report.txt
question6/backend_report.txt
`;
