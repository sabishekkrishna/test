# Question 5: Parameterized Pipeline & when Directive

## Contents
- `Jenkinsfile`: Defines `choice` parameter `ENVIRONMENT` (dev, staging, prod) and `booleanParam` `RUN_EXTRA_CHECK`. Controls the `Extra Check` stage using `when { expression { params.RUN_EXTRA_CHECK == true } }`.
- `app.py`: Application supporting `--extra` parameter.

## Why the First Build Does Not Show "Build with Parameters"
When creating a new Jenkins pipeline from SCM, Jenkins has not yet cloned the repository or parsed the `Jenkinsfile`. The parameter definitions are stored in code in the repository.
Therefore, the first execution must be triggered using **"Build Now"**. During Build 1, Jenkins checks out the repo, parses the Declarative pipeline's `parameters` block, and registers the parameters into the job's configuration. Subsequent builds will then display the **"Build with Parameters"** GUI option in the sidebar.

## Pipeline Views Comparison
- **Checkbox Checked (`RUN_EXTRA_CHECK: true`)**: The `Extra Check` stage executes and shows as **green/passed** in the Stage View.
- **Checkbox Unchecked (`RUN_EXTRA_CHECK: false`)**: The `Extra Check` stage is evaluated by the `when` directive, skipped, and shows as **gray/skipped** ("Stage skipped due to when conditional") in the Stage View.
