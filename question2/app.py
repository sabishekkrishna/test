"""
Question 2: Number utility functions.
"""

def find_min(numbers):
    """
    Returns the minimum number from a list of numbers.
    Raises ValueError if list is empty.
    """
    if not numbers:
        raise ValueError("List cannot be empty.")
    return min(numbers)


def count_odds(numbers):
    """
    Counts how many odd integers are present in the given list.
    """
    return sum(1 for n in numbers if n % 2 != 0)


if __name__ == "__main__":
    sample = [4, 7, 2, 9, 1, 8]
    print(f"find_min: {find_min(sample)}")
    print(f"count_odds: {count_odds(sample)}")
