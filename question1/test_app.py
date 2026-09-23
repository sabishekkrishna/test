"""
Unit tests for Question 1 app.py.
"""
import pytest
from app import multiply, divide


def test_multiply():
    """Test multiply function."""
    assert multiply(3, 4) == 12
    assert multiply(-2, 5) == -10
    assert multiply(0, 100) == 0


def test_divide():
    """Test divide function."""
    assert divide(10, 2) == 5.0
    assert divide(-9, 3) == -3.0
    with pytest.raises(ValueError):
        divide(5, 0)
