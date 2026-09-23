"""
Question 3: Application entry point.
"""
import os

def run():
    app_name = os.environ.get("APP_NAME", "PaymentService")
    app_version = os.environ.get("APP_VERSION", "v1.2.0")
    print(f"Deploying and running {app_name} version {app_version} successfully!")


if __name__ == "__main__":
    run()
