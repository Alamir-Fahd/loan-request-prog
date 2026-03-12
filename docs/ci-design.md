# CI/CD Pipeline Design - Squad Simple-Auth

## 1. Pipeline Stages
Our pipeline consists of three sequential stages:
* **Lint**: Uses `node --check` to verify syntax and catch basic errors before any code runs.
* **Build**: Validates that the application can be successfully containerized into a Docker image.
* **Test**: Executes our automated test suite to ensure the authentication logic (login/password checks) functions as expected.

## 2. Trigger Events
The pipeline is triggered automatically on two events:
* **Pull Requests**: To validate changes before they are merged into the main branch.
* **Push to Main**: To ensure the main branch remains stable and "Green."

## 3. Quality Gate
Our Quality Gate is strictly "All-or-Nothing." A Pull Request is blocked from merging if any of the three jobs (Lint, Build, or Test) fails. This ensures no broken code or insecure images reach production.

## 4. Performance Optimization
To ensure the pipeline finishes in under 10 minutes:
* We use the lightweight `node:18-alpine` base image to reduce download and build times.
* We utilize Docker layer caching by copying `package.json` and running `npm ci` before copying the rest of the source code.
* We use `npm ci` instead of `npm install` for faster, more reliable dependency installation in automated environments.
