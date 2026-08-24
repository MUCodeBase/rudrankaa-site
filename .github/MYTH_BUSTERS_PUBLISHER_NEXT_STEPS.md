# Manual GitHub setup still required

The publisher branch contains the website-side scaffolding. Before the workflow can be enabled on `main`, complete these account-level steps in GitHub.

1. Create repository `MUCodeBase/rudrankaa-myth-busters` (private is recommended).
2. Add an `uploads/` directory and a short README explaining the filename convention.
3. Give the Myth Busters collaborator Write access only to `rudrankaa-myth-busters`.
4. Create a private GitHub App named `Rudrankaa Publisher`.
5. Install the App only on `rudrankaa-site` and `rudrankaa-myth-busters`.
6. Set repository permissions on the App to the minimum required:
   - Contents: Read and write
   - Pull requests: Read and write
   - Metadata: Read
7. Generate one GitHub App private key (`.pem`). Keep it off the repository.
8. In `rudrankaa-site` → Settings → Secrets and variables → Actions:
   - add variable `RUDRANKAA_PUBLISHER_CLIENT_ID` with the App Client ID;
   - add secret `RUDRANKAA_PUBLISHER_PRIVATE_KEY` containing the full PEM private key.
9. In `rudrankaa-site` → Settings → General → Pull Requests, enable **Allow auto-merge** so the automated PR can wait for the required `validate` check and merge only after the ruleset permits it.
10. Test with one non-production/sample upload before approving the publisher branch for merge.

Do not add the GitHub App to the `main` ruleset bypass list. The intended path is still branch → PR → required validation → merge.
