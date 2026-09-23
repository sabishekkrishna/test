"""
Question 5: Application supporting optional extra check.
"""
import sys

def main():
    if "--extra" in sys.argv:
        print("Running extra validation checks... PASSED")
    else:
        print("Standard application execution.")


if __name__ == "__main__":
    main()
