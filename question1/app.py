"""
Question 1: Multiply and divide functions.
"""

def multiply(a, b):
    """Returns the product of a and b."""
    return a * b  # To break for second build: change to return a + b


def divide(a, b):
    """
    Returns the quotient of a divided by b.
    Raises ValueError when dividing by zero.
    """
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b


if __name__ == "__main__":
    print(f"multiply(6, 7) = {multiply(6, 7)}")
    print(f"divide(20, 4) = {divide(20, 4)}")
