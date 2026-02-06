---
description: How to deploy the CAPSTACK application to Render
---

This workflow guides you through deploying the full CAPSTACK suite (Frontend, Backend-API, and ML-Service) to Render using Blueprint Yaml.

### 1. Prerequisites
- A Render account.
- Your project pushed to a GitHub repository.
- A PostgreSQL database (can be created via Blueprint).

### 2. Deployment via Blueprint
Render Blueprints allow you to configure multiple services at once.

1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `infra/render.yaml` file.
5. Review the plan and click **Apply**.

### 3. Environment Variables
Ensure the following variables are configured in the Render Dashboard if they are not picked up from the blueprint:

#### Backend API
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: A secure string for authentication.
- `REDIS_ENABLED`: Set to `false` for free tier if not using Redis.

#### Frontend
- `NEXT_PUBLIC_API_URL`: The URL of your deployed backend service (automatically handled by the blueprint).

### 4. Manual Configuration (Optional)
If you prefer manual setup per service:

**Backend:**
- **Build Command:** `cd backend-api && npm install && npm run build`
- **Start Command:** `cd backend-api && npm start`

**Frontend:**
- **Build Command:** `cd frontend && npm install && npm run build`
- **Start Command:** `cd frontend && npm start`

**ML Service:**
- **Build Command:** `cd ml-service && pip install -r requirements.txt`
- **Start Command:** `cd ml-service && uvicorn app.main:app --host 0.0.0.0 --port 10000`

### 5. Troubleshooting
- **Build Failures:** Check the Render build logs. Ensure the `--webpack` flag is used in the frontend build script if using Next.js 16+ with PWA.
- **Connection Issues:** Ensure the `NEXT_PUBLIC_API_URL` is correctly set and pointing to the backend's internal or external URL.
