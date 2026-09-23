"""
Question 7: Application source for compilation and notification.
"""

def compute_total(price, tax_rate=0.08):
    """Computes total price including tax."""
    return round(price * (1 + tax_rate), 2)


if __name__ == "__main__":
    print(f"Total: {compute_total(100)}")
