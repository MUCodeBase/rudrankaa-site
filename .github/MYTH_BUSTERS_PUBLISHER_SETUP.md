# Rudrankaa Myth Busters Publisher Setup

This document records the secure setup for the separate Myth Busters publishing flow.

## Security model

The production repository remains protected. The collaborator should not receive write access to `rudrankaa-site`.

A separate repository named `rudrankaa-myth-busters` will be used for source PNG uploads. Automation in `rudrankaa-site` will read validated uploads from that repository and publish them through a protected pull request.

## GitHub App

Create a private GitHub App named `Rudrankaa Publisher` and install it only on:

- `MUCodeBase/rudrankaa-site`
- `MUCodeBase/rudrankaa-myth-busters`

Use minimum repository permissions required by the publishing workflow:

- Contents: Read and write
- Pull requests: Read and write
- Metadata: Read (automatic)

Do not grant Administration or Actions write permission unless a later implementation proves it is required.

## Secrets

Store the GitHub App private key as a GitHub Actions secret in `rudrankaa-site` only. Never commit the private key or an installation token to the repository.

Recommended names:

- `RUDRANKAA_PUBLISHER_APP_ID` (the App ID is not sensitive, but storing it as a variable/secret is convenient)
- `RUDRANKAA_PUBLISHER_PRIVATE_KEY` (secret)

The workflow should generate a short-lived installation access token at runtime. Do not store the generated installation token as a long-lived repository secret.

## Public repository note

`rudrankaa-site` being public does not make GitHub Actions secrets public. Repository files can reference a secret by name, but visitors cannot read the secret value. GitHub encrypts Actions secrets and redacts secret values from logs. Workflows triggered by pull requests from forks do not receive repository secrets.

The publishing workflow should therefore run only from trusted events such as `schedule` and `workflow_dispatch` on the default branch, not from untrusted pull-request code.

## Collaborator workflow

The collaborator only needs access to `rudrankaa-myth-busters` and should upload files to:

`uploads/MB_<counter>_DDMMYYYY.png`

The collaborator should not manually create thumbnails or manifests.

## Production publishing flow

1. Detect new valid PNGs in `rudrankaa-myth-busters/uploads/`.
2. Compare them against published source PNGs in `rudrankaa-site/assets/myth-busters/`.
3. Ignore files already published with the same content.
4. Reject duplicate counters or attempts to silently replace an existing published flyer.
5. Create a temporary publishing branch from the latest `main`.
6. Copy only validated new source PNGs into `assets/myth-busters/`.
7. Run the existing thumbnail and manifest builders.
8. Run Site Health validation.
9. Push the branch and open a PR into `main`.
10. Enable auto-merge after required checks pass.

Deleting a source file from the upload repository must not automatically delete a published Myth Buster from production.
