# NoteApp Backend

## Description
This is the backend service for the NoteApp project. It provides a REST API for user authentication, note management, and category handling. It is implemented using Node.js with Express and uses PostgreSQL for data persistence.

## Deployment
The backend is deployed on Render:
- Base URL: `https://lopez-dbe4d5-backend.onrender.com/api`

## Default Credentials
For login purposes, use the following default credentials:
- **email:** user@email.com
- **Password:** 123

## Live Frontend
The frontend is live and accessible at:
- URL: `https://ensolvers-noteapp.netlify.app/`

## Prerequisites
To run this application, ensure you have the following installed:
- Node.js v22.12.0
- pnpm 9.14.4
- PostgreSQL (if running locally)
- Linux/macOS environment

Here’s the corrected and clearer version of the **Setup Instructions**:

## Setup Instructions
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Ensure the setup script has execute permissions (if not already set):
   ```bash
   chmod +x setup.sh
   ```

3. Run the setup script:
   ```bash
   ./setup.sh
   ```
