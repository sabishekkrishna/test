# Question 2: Verbose Parametrized Testing with Pytest

## Contents
- `Jenkinsfile`: Pipeline with stages Checkout, Install Dependencies, and Run Unit Tests (verbose: `pytest -v`).
- `app.py`: Contains `find_min(numbers)` and `count_odds(numbers)`.
- `test_app.py`: Uses `@pytest.mark.parametrize` testing 3 cases per function.
- `requirements.txt`: Contains `pytest`.

## Explanation: Why Test Count (6) Differs from Test Function Count (2)
There are only **2 test functions** in code (`test_find_min` and `test_count_odds`).
Because each function is decorated with `@pytest.mark.parametrize` providing **3 parameter tuples**, pytest generates and executes each parameter combination independently:
- 2 test functions × 3 input cases = **6 tests ran**.

## Console Output (-v flag)
```text
question2/test_app.py::test_find_min[numbers0-1] PASSED   [ 16%]
question2/test_app.py::test_find_min[numbers1--20] PASSED [ 33%]
question2/test_app.py::test_find_min[numbers2-42] PASSED  [ 50%]
question2/test_app.py::test_count_odds[numbers0-3] PASSED [ 66%]
question2/test_app.py::test_count_odds[numbers1-0] PASSED [ 83%]
question2/test_app.py::test_count_odds[numbers2-4] PASSED [100%]
============================== 6 passed in 0.09s ==============================
```

## Failure Isolation
When case 2 of `test_count_odds` has a wrong expected value (e.g., `99` instead of `0`), only `test_count_odds[numbers1-99]` fails with `AssertionError: assert 0 == 99`, while the other 5 test cases pass cleanly (`1 failed, 5 passed`).
