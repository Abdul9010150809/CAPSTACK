# 404 Error - Comprehensive Troubleshooting Guide

## Problem Summary

Your application is receiving a **404 Not Found** error when trying to access the asset allocation endpoint:
```
GET https://capstack-2k25-backend.onrender.com/finance/asset-allocation → 404
```

This guide will help you identify the exact cause and fix it.

---

## Step 1: Verify the Endpoint Exists on Backend

### Backend Route Definition
The endpoint **should exist** at:
```
File: backend-api/src/routes/financeRoutes.ts
Line: 102
Route: router.get("/asset-allocation", optionalAuthMiddleware, async (req, res) => {
```

### Backend Mount Point
The route is mounted at:
```
File: backend-api/src/app.ts  
Line: 89
Mount: app.use("/finance", financeRoutes);
```

**Expected Full Path:**
- Local: `http://localhost:3001/finance/asset-allocation`
- Production: `https://capstack-2k25-backend.onrender.com/finance/asset-allocation`

---

## Step 2: Diagnose Using Browser Console

When you get the 404 error, check your browser console for detailed information:

### What to Look For

1. **Error Message in Console:**
   ```
   Asset Allocation API Error: [object Object]
   Error details: {
     status: 404,
     statusText: "Not Found",
     url: "...",
     baseURL: "...",
     message: "...",
     responseData: {...}
   }
   ```

2. **Check the Exact URL Being Called:**
   - Look at the `url` field in the error object
   - Compare with the expected URL
   
3. **Check Base URL:**
   - Look at the `baseURL` field
   - Verify it's correct:
     - Local: `http://localhost:3001`
     - Production: `https://capstack-2k25-backend.onrender.com`

### Example Error Output

```javascript
// If you see this:
{
  status: 404,
  statusText: "Not Found",
  url: "/finance/asset-allocation",
  baseURL: "https://capstack-2k25-backend.onrender.com",
  message: "Request failed with status code 404",
  responseData: null
}

// The full URL being called is:
// https://capstack-2k25-backend.onrender.com + /finance/asset-allocation
// = https://capstack-2k25-backend.onrender.com/finance/asset-allocation
```

---

## Step 3: Check Network Tab (DevTools)

1. **Open DevTools:** Press `F12`
2. **Go to Network tab**
3. **Reload the allocation page** (e.g., `/allocation`)
4. **Look for the failed request:**
   - Filter by `/finance/asset-allocation` or `asset-allocation`
   - Should show a red entry or status code 404
   - Click on it to see:
     - **Request URL:** The exact URL being called
     - **Request Method:** Should be `GET`
     - **Request Headers:** Check for `Authorization` header
     - **Response Status:** Should show `404`
     - **Response Body:** May show error message from backend

### What Might Be Missing

- ❌ **Missing endpoint:** The route might not be registered
- ❌ **Wrong path:** The frontend might be calling a different path
- ❌ **Routes not mounted:** `app.use("/finance", financeRoutes)` might be missing
- ❌ **Backend not running:** The server might not be running at all
- ❌ **Route file not exported:** The `export default router` might be missing

---

## Step 4: Common Causes & Solutions

### Cause 1: Backend Routes Not Properly Exported

**Check:** `backend-api/src/routes/financeRoutes.ts`

```typescript
// ✅ CORRECT - at end of file
export default router;

// ❌ WRONG - commented out or missing
// export default router;
```

**Fix:** Ensure the file ends with `export default router;`

---

### Cause 2: Routes Not Mounted in App

**Check:** `backend-api/src/app.ts`

```typescript
import financeRoutes from "./routes/financeRoutes";

// Must be present:
app.use("/finance", financeRoutes);
```

**Fix:** Verify both the import and `app.use()` lines are present.

---

### Cause 3: Wrong Base URL on Frontend

**Check:** `frontend/src/utils/axiosClient.ts`

```typescript
const BACKEND_BASE_URL = baseURL ? baseURL.replace(/\/$/, "") : "https://capstack-2k25-backend.onrender.com";
```

**Verify:**
- ✅ Local dev: Should detect `localhost` and use `http://localhost:3001`
- ✅ Production: Should use `https://capstack-2k25-backend.onrender.com`
- ✅ No trailing slash: The `.replace(/\/$/, "")` removes trailing slash

---

### Cause 4: Backend Not Running / Server Offline

**Check locally:**
```bash
# Terminal 1: Check if backend is running
curl http://localhost:3001/health

# Should respond with something like:
# {"status":"ok"}
```

**Check production:**
```bash
# Check if Render service is running
curl https://capstack-2k25-backend.onrender.com/health

# Should respond with:
# {"status":"ok"}
```

**Fix:** 
- Make sure backend is running: `npm run dev` in `backend-api`
- On Render: Check the service is deployed and active

---

### Cause 5: Route Path Mismatch

**Frontend expects:**
```
/finance/asset-allocation
```

**But backend has:**
```
/asset-allocation  (without /finance prefix)
```

**Fix:** Ensure the mount path matches:
```typescript
// backend-api/src/app.ts
app.use("/finance", financeRoutes);  // This adds /finance prefix
```

---

## Step 5: Verification Checklist

Before deploying or testing further:

- [ ] Backend route exists: `router.get("/asset-allocation", ...)`
- [ ] Routes mounted: `app.use("/finance", financeRoutes)`
- [ ] Routes exported: `export default router` at end of financeRoutes.ts
- [ ] Frontend calls correct path: `api.get('/finance/asset-allocation')`
- [ ] Backend is running: `curl /health` returns 200
- [ ] Base URL is correct:
  - [ ] Local: `http://localhost:3001`
  - [ ] Production: `https://capstack-2k25-backend.onrender.com`
- [ ] No trailing slash in base URL
- [ ] CORS is configured to allow frontend origin
- [ ] TypeScript builds without errors: `npm run build`

---

## Step 6: Debug Commands

### Test Backend Endpoint Directly

```bash
# Test health endpoint (should work)
curl https://capstack-2k25-backend.onrender.com/health

# Test asset allocation endpoint
curl https://capstack-2k25-backend.onrender.com/finance/asset-allocation

# Test with guest auth header
curl -H "Authorization: Bearer guest" \
  https://capstack-2k25-backend.onrender.com/finance/asset-allocation

# Test locally
curl http://localhost:3001/health
curl http://localhost:3001/finance/asset-allocation
```

### Check Backend Logs

If using Render:
1. Go to your backend service
2. Click "Logs" tab
3. Look for any errors related to routes or `/finance`

If running locally:
```bash
cd backend-api
npm run dev
# Look for output like:
# Server running on http://localhost:3001
# Routes registered: /finance/asset-allocation, /finance/health, etc.
```

---

## Step 7: Enhanced Error Messages

The frontend now provides detailed 404 information when you see the error:

```
Endpoint not found (404): The API endpoint /finance/asset-allocation 
does not exist on the backend at https://capstack-2k25-backend.onrender.com. 
Available endpoints: /finance/asset-allocation, /finance/health
```

**What this tells you:**
- The exact endpoint that failed
- The base URL being used
- List of available endpoints to test

---

## Quick Fix Checklist (If Still Getting 404)

1. **Clear browser cache:**
   ```
   F12 → Application → Clear Site Data
   ```

2. **Check backend is running:**
   ```
   curl https://capstack-2k25-backend.onrender.com/health
   ```

3. **Check route is exported:**
   ```bash
   grep "export default router" backend-api/src/routes/financeRoutes.ts
   ```

4. **Check route is mounted:**
   ```bash
   grep 'app.use("/finance"' backend-api/src/app.ts
   ```

5. **Rebuild frontend:**
   ```bash
   cd frontend
   npm run build
   ```

6. **Rebuild backend:**
   ```bash
   cd backend-api
   npm run build
   ```

7. **Check browser console for exact URL and compare with backend routes**

---

## Still Having Issues?

If you've checked all of the above and still see 404:

1. **Share the error object from console:**
   - F12 → Console
   - Find "Error details: Object"
   - Expand it and share the full object

2. **Check backend server logs:**
   - If on Render: Look at the Logs tab
   - If local: Check npm run dev output

3. **Verify file structure:**
   ```bash
   ls -la backend-api/src/routes/financeRoutes.ts
   ls -la backend-api/src/app.ts
   ```

4. **Check git history:**
   ```bash
   git log --oneline | grep -i "route\|endpoint"
   ```

---

## Summary

The 404 error means the backend endpoint doesn't exist at the URL being called. Use the steps above to:

1. Verify the endpoint exists on the backend
2. Verify it's properly exported and mounted
3. Verify the frontend is calling the correct URL
4. Verify the backend server is actually running

Most 404 errors are caused by:
- ❌ Route not exported
- ❌ Routes not mounted
- ❌ Backend not running
- ❌ Wrong base URL
- ❌ URL path mismatch

Use the debugging steps above to identify and fix the specific issue.

