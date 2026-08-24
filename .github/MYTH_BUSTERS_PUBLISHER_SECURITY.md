# Myth Busters Publisher Security Notes

## What is public

The workflow YAML, GitHub App name, GitHub App Client ID/App ID, repository names and Actions secret names may be visible in the public `rudrankaa-site` repository. These values are not authentication credentials.

## What must remain secret

The GitHub App private key must be stored only as a GitHub Actions secret. Never commit the `.pem` private-key file or paste its contents into repository files, issues, pull requests or workflow YAML.

The publisher generates a short-lived GitHub App installation token at workflow runtime. The generated token must not be committed or persisted as a repository file or long-lived secret.

## Workflow trigger boundary

The publisher workflow must run only from trusted default-branch events such as `schedule` and `workflow_dispatch`. It must not use `pull_request_target`, and it must not execute workflow code supplied by an untrusted fork while publisher credentials are available.

## App installation scope

Install the `Rudrankaa Publisher` GitHub App only on the two repositories required for publishing:

- `MUCodeBase/rudrankaa-site`
- `MUCodeBase/rudrankaa-myth-busters`

Grant only the repository permissions required for the workflow. Avoid Administration, Actions write and other unrelated permissions unless later testing demonstrates a specific need.
