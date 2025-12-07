#!/bin/bash

# CAPSTACK Backend Health Check Script
# Diagnoses common backend connection and configuration issues

echo "════════════════════════════════════════════════════════════════"
echo "  CAPSTACK Backend Health Check"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check 1: Node.js Installation
echo "1️⃣  Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo ""

# Check 2: npm Installation
echo "2️⃣  Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm installed: $NPM_VERSION"
else
    echo "   ❌ npm not found"
    exit 1
fi
echo ""

# Check 3: Backend Directory
echo "3️⃣  Checking backend directory..."
if [ -d "backend-api" ]; then
    echo "   ✅ backend-api directory exists"
else
    echo "   ❌ backend-api directory not found"
    exit 1
fi
echo ""

# Check 4: package.json
echo "4️⃣  Checking package.json..."
if [ -f "backend-api/package.json" ]; then
    echo "   ✅ package.json exists"
else
    echo "   ❌ package.json not found"
    exit 1
fi
echo ""

# Check 5: node_modules
echo "5️⃣  Checking dependencies..."
if [ -d "backend-api/node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ⚠️  node_modules not found. Run: cd backend-api && npm install"
fi
echo ""

# Check 6: TypeScript Compilation
echo "6️⃣  Checking TypeScript compilation..."
cd backend-api
if npm run build 2>&1 | grep -q "error"; then
    echo "   ❌ TypeScript build failed. See errors above."
else
    echo "   ✅ TypeScript compilation successful"
fi
echo ""

# Check 7: Environment Variables
echo "7️⃣  Checking environment variables..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "PORT=" .env; then
        PORT=$(grep "PORT=" .env | cut -d'=' -f2)
        echo "     📌 PORT=$PORT"
    else
        echo "     ⚠️  PORT not set (default: 3001)"
    fi
    if grep -q "DATABASE_URL=" .env; then
        echo "     ✅ DATABASE_URL is set"
    else
        echo "     ⚠️  DATABASE_URL not set (optional for local development)"
    fi
else
    echo "   ℹ️  .env file not found. Using defaults or environment variables"
fi
echo ""

# Check 8: Required environment variables
echo "8️⃣  Checking required configuration..."
cd ..
if [ -z "$JWT_SECRET" ] && [ ! -f "backend-api/.env" ]; then
    echo "   ⚠️  JWT_SECRET not set (optional for local development)"
else
    echo "   ✅ JWT_SECRET is configured"
fi
echo ""

# Check 9: Port availability
echo "9️⃣  Checking port availability..."
PORT=${PORT:-3001}
if command -v lsof &> /dev/null; then
    if lsof -i :$PORT &> /dev/null; then
        PID=$(lsof -i :$PORT | awk 'NR==2 {print $2}')
        echo "   ⚠️  Port $PORT is in use by process $PID"
        echo "     Recommendation: Kill the process or use a different port"
    else
        echo "   ✅ Port $PORT is available"
    fi
else
    echo "   ℹ️  lsof not available (skip port check)"
fi
echo ""

# Check 10: Database connectivity (if DATABASE_URL is set)
echo "🔟 Checking database connectivity..."
if [ -f "backend-api/.env" ] && grep -q "DATABASE_URL=" backend-api/.env; then
    DB_URL=$(grep "DATABASE_URL=" backend-api/.env | cut -d'=' -f2)
    if command -v psql &> /dev/null; then
        if psql "$DB_URL" -c "SELECT 1" &> /dev/null; then
            echo "   ✅ Database connection successful"
        else
            echo "   ❌ Database connection failed"
            echo "     Check DATABASE_URL in .env file"
        fi
    else
        echo "   ℹ️  psql not available (skip database test)"
        echo "     Ensure DATABASE_URL is correctly formatted:"
        echo "     postgresql://username:password@host:port/database"
    fi
else
    echo "   ℹ️  DATABASE_URL not set (optional for local demo)"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "  Health Check Complete!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Fix any ❌ errors shown above"
echo "2. Run: cd backend-api && npm run dev"
echo "3. Backend will start on http://localhost:3001"
echo "4. Test: curl http://localhost:3001/health"
echo ""
