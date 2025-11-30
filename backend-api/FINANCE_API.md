Backend Finance API — Routes and Contracts

This file documents the backend finance-related endpoints, request bodies, and example responses. Use this as the canonical contract for frontend integration.

Authentication
--------------
- POST /auth/login
  - body: { "email": string, "password": string }
  - 200: { "token": string, "user": { id, name, email } }
  - 401: { "error": "Invalid credentials" }

- POST /auth/register
  - body: { "name", "email", "password" }
  - 201: { "userId": string }

User Profile
------------
- GET /user/profile
  - headers: Authorization: Bearer <token>
  - 200: { userId, age, industry, experienceYears, jobRole, riskTolerance, monthlyIncome, monthlyExpenses }

- PUT /user/profile
  - headers: Authorization: Bearer <token>
  - body: { age, industry, experienceYears, jobRole, riskTolerance, monthlyIncome, monthlyExpenses }
  - 200: { status: "ok", profile }

Finance / Insights
------------------
- GET /finance/insights
  - headers: Authorization: Bearer <token>
  - Example response:
    {
      "summary": {
        "monthlyNet": 1200,
        "savingsRate": 24.5,
        "emergencyMonths": 3.7
      },
      "alerts": [ { "id": "a1", "type": "low_emergency", "message": "Emergency fund below 6 months" } ],
      "trends": { "income": [ { date, value } ], "expenses": [ { date, value } ] }
    }

- GET /finance/asset-allocation
  - headers: Authorization: Bearer <token>
  - Query params: none
  - Response:
    {
      "allocation": {
        "sipPct": 10,
        "stocksPct": 50,
        "bondsPct": 20,
        "lifestylePct": 10,
        "emergencyPct": 10
      },
      "amounts": { "sip": 2000, "stocks": 10000, "bonds": 4000, "lifestyle": 2000, "emergency": 4000 },
      "reasoning": { "explain": "Model suggests risk-on due to age and job stability" }
    }

- POST /finance/allocation-optimize
  - headers: Authorization: Bearer <token>
  - body: { "market": { /* optional market conditions */ }, "constraints": { maxStocksPct } }
  - 200: same as GET /finance/asset-allocation

Savings
-------
- GET /savings/status
  - headers: Authorization: Bearer <token>
  - Response: { totalSaved, locked, available, monthlyAutoSave, plans }

- POST /savings/lock
  - headers: Authorization: Bearer <token>
  - body: { planId, amount }
  - 200: { status: "locked", plan }

Emergency Fund
--------------
- GET /finance/emergency-status
  - headers: Authorization: Bearer <token>
  - Response:
    { "months": 3.2, "riskLevel": "medium", "recommendedTopUps": [ { amount, reason } ] }

Errors and Authentication
-------------------------
- 401 responses: { "error": "No token provided" } or { "error": "Invalid token" }
- 400 responses: { "error": "Bad Request", details: [...] }

Notes
-----
- The backend currently implements many of these endpoints; where an ML service is required, the backend will attempt to call the ML microservice (env var `ML_SERVICE_URL`) and fall back to rule-based heuristics if unavailable.
- Keep responses small and consistent to avoid large payloads for dashboard load. Provide endpoints for aggregated metrics to avoid multiple fine-grained calls.

