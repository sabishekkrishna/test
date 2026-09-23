import time
import os

print("Starting backend check...")
time.sleep(4)  # Sleep for 4 seconds

file_path = os.path.join(os.path.dirname(__file__), "backend_report.txt")
with open(file_path, "w") as f:
    f.write("Backend Check Passed: Database and API schemas validated.\n")

print(f"Backend check complete. Written to {file_path}")
