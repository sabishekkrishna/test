# Question 7: Concurrency Control with milestone(1) & Notifications

## Contents
- `Jenkinsfile`: Compiles `app.py`, sleeps 15 seconds, passes `milestone(1)`, and sends an email notification with `JOB_NAME`, `BUILD_NUMBER`, and `BUILD_URL` (with echo workaround if SMTP is not configured).
- `app.py`: Source code for compile check.

## What Happens When "Build Now" Is Clicked Twice in Quick Succession?
1. Build 1 starts and enters the 15-second `sleep 15`.
2. Build 2 starts shortly after, compiles, and also enters its sleep.
3. When the newer build (Build 2) passes `milestone(1)`, Jenkins enforces that **older builds cannot pass a milestone that has already been passed by a newer build**.
4. Jenkins automatically **aborts** Build 1 at the milestone step with the message:
   `Milestone 1: superseded by build #2`
5. **Does the older build send a notification?**
   **NO.** Because Build 1 is aborted inside the `Build` stage, it never reaches the `Send Notification` stage. Only Build 2 continues and sends the notification.

## Why Introducing a Syntax Error Sends No Email
When a syntax error is introduced into `app.py` (e.g. missing parenthesis), `python -m py_compile` fails with exit code 1.
In Jenkins pipelines, step failures immediately fail the current stage and halt execution. Since `Send Notification` is a standard sequential stage and not inside a `post { always { ... } }` or `post { failure { ... } }` block, it is skipped entirely. Hence, no email is sent.
