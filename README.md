# Enterprise Loan Pre-Screening API

An asynchronous, distributed backend architecture for processing loan applications. This system utilizes a microservices approach to guarantee task execution, cache high-latency data, and separate business logic from the application code.

## 🏗️ Architecture & Tech Stack
* **API Gateway:** Node.js & Express (`src/index.js`)
* **Orchestration:** Temporal (`src/workflow.js` & `src/activities.js`)
* **Caching Layer:** Redis (`src/redis.js`)
* **Business Logic:** JSON Rules Engine (`src/ruleEngine.js` & `rules.json`)
* **Containerization:** Docker & Docker Compose

## 📂 Project Structure (Local)
The core logic resides in the `src/` directory, while infrastructure definitions sit at the root.

\`\`\`text
loan-request-prog/
├── docker-compose.yml   # Infrastructure definitions (Temporal cluster, Redis, Node)
├── Dockerfile           # Blueprint for the Node API container
├── rules.json           # Extracted business rules for loan approval/rejection
└── src/
    ├── index.js         # Express server & API routes
    ├── workflow.js      # Temporal workflow definitions (The Project Manager)
    ├── activities.js    # Individual Temporal tasks (Background checks, etc.)
    ├── ruleEngine.js    # Evaluates application data against rules.json
    ├── redis.js         # Redis cache connection and query logic
    └── ...
\`\`\`
*(Note: CI/CD configurations like `.github/` and automated testing folders like `tests/` are omitted from the local runtime environment to keep the container lightweight).*

## 🚀 Quick Start Guide

# Step 1: Boot the Infrastructure
Ensure Docker Desktop is running, then start the Temporal cluster, Redis instance, and Express API.

## Step 2: Submit a Loan Application
Once the services are healthy, the API will be available on port 3000. You can trigger the asynchronous Temporal workflow by sending a POST request with the applicant's data.

curl -X POST http://localhost:3000/applications \
-H "Content-Type: application/json" \
-d '{
  "applicantId": "12345",
  "income": 75000,
  "debt": 20000
}'

### Step 3: The Background Process
When the request is received:

Express instantly returns a workflowId (acting as a receipt).
Temporal begins executing activities.js.
The system checks Redis for a cached credit score. If a cache miss occurs, it simulates a background check and saves the new score to Redis.
The JSON Rules Engine evaluates the income, debt, and credit score against rules.json to return a final status of Approved, Referred, or Rejected.
