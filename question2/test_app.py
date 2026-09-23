"""
Parametrized unit tests using @pytest.mark.parametrize.
"""
import pytest
from app import find_min, count_odds


@pytest.mark.parametrize("numbers, expected", [
    ([3, 1, 4, 1, 5, 9], 1),
    ([-5, 0, 15, -20], -20),
    ([42], 42)
])
def test_find_min(numbers, expected):
    """Test find_min with three distinct input cases."""
    assert find_min(numbers) == expected


@pytest.mark.parametrize("numbers, expected", [
    ([1, 2, 3, 4, 5], 3),
    ([2, 4, 6, 8], 0),       # To demonstrate failure: change expected 0 to 99
    ([7, -3, 11, 0, 1], 4)
])
def test_count_odds(numbers, expected):
    """Test count_odds with three distinct input cases."""
    assert count_odds(numbers) == expected
