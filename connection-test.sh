#!/bin/bash

# CAPSTACK Connection Test Script
# Tests frontend-to-backend connectivity

echo "════════════════════════════════════════════════════════════════"
echo "  CAPSTACK Connection Test"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Default backend URL
BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL:-http://localhost:3001}"
FRONTEND_URL="${NEXT_PUBLIC_FRONTEND_URL:-http://localhost:3000}"

echo "📊 Testing Configuration:"
echo "   Frontend URL: $FRONTEND_URL"
echo "   Backend URL:  $BACKEND_URL"
echo ""

# Test 1: Check if backend is reachable
echo "1️⃣  Testing backend health endpoint..."
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
    if [ "$RESPONSE" = "200" ]; then
        echo "   ✅ Backend is responding (HTTP $RESPONSE)"
        
        # Get detailed health info
        HEALTH_DATA=$(curl -s "$BACKEND_URL/health")
        echo "   📝 Health data: $HEALTH_DATA"
    else
        echo "   ❌ Backend returned HTTP $RESPONSE"
        echo "   Possible issues:"
        echo "   - Backend is not running"
        echo "   - Wrong backend URL in environment"
        echo "   - Network/firewall blocking connection"
    fi
else
    echo "   ℹ️  curl not available (skip health test)"
fi
echo ""

# Test 2: Test CORS preflight
echo "2️⃣  Testing CORS preflight request..."
if command -v curl &> /dev/null; then
    CORS_RESPONSE=$(curl -s -X OPTIONS "$BACKEND_URL/health" \
        -H "Origin: $FRONTEND_URL" \
        -H "Access-Control-Request-Method: GET" \
        -w "\n%{http_code}")
    
    HTTP_CODE=$(echo "$CORS_RESPONSE" | tail -1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ CORS preflight successful (HTTP $HTTP_CODE)"
    else
        echo "   ⚠️  CORS preflight returned HTTP $HTTP_CODE"
        echo "   Backend may reject frontend requests"
    fi
else
    echo "   ℹ️  curl not available (skip CORS test)"
fi
echo ""

# Test 3: Test guest login endpoint
echo "3️⃣  Testing guest login endpoint..."
if command -v curl &> /dev/null; then
    GUEST_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/guest" \
        -H "Content-Type: application/json" \
        -H "Origin: $FRONTEND_URL" \
        -w "\n%{http_code}")
    
    HTTP_CODE=$(echo "$GUEST_RESPONSE" | tail -1)
    BODY=$(echo "$GUEST_RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Guest login successful (HTTP $HTTP_CODE)"
        echo "   Token issued: $(echo $BODY | grep -o '"token":"[^"]*"' | cut -d'"' -f4 | cut -c1-20)..."
    else
        echo "   ⚠️  Guest login returned HTTP $HTTP_CODE"
        echo "   Response: $BODY"
    fi
else
    echo "   ℹ️  curl not available (skip guest login test)"
fi
echo ""

# Test 4: Test asset allocation endpoint
echo "4️⃣  Testing asset allocation endpoint (guest)..."
if command -v curl &> /dev/null; then
    ALLOC_RESPONSE=$(curl -s "$BACKEND_URL/finance/asset-allocation" \
        -H "Origin: $FRONTEND_URL" \
        -w "\n%{http_code}")
    
    HTTP_CODE=$(echo "$ALLOC_RESPONSE" | tail -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Asset allocation endpoint works (HTTP $HTTP_CODE)"
    else
        echo "   ⚠️  Asset allocation returned HTTP $HTTP_CODE"
    fi
else
    echo "   ℹ️  curl not available (skip asset allocation test)"
fi
echo ""

# Test 5: Network connectivity
echo "5️⃣  Testing network connectivity..."
if command -v ping &> /dev/null; then
    # Extract hostname from URL
    HOSTNAME=$(echo $BACKEND_URL | sed -e 's|^[^/]*//||' | sed -e 's|/.*$||' | cut -d':' -f1)
    
    if ping -c 1 -W 2 $HOSTNAME &> /dev/null; then
        echo "   ✅ Network connectivity OK to $HOSTNAME"
    else
        echo "   ❌ Cannot reach $HOSTNAME"
        echo "   Check:"
        echo "   - Backend URL is correct"
        echo "   - Network/firewall settings"
        echo "   - Backend service is running"
    fi
else
    echo "   ℹ️  ping not available (skip connectivity test)"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "  Connection Test Complete!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Troubleshooting:"
echo "• If backend tests fail:"
echo "  - Ensure backend is running: cd backend-api && npm run dev"
echo "  - Check BACKEND_URL environment variable"
echo ""
echo "• If CORS fails:"
echo "  - Verify FRONTEND_URL is in backend CORS allowlist"
echo "  - Set FRONTEND_URL in backend .env"
echo ""
echo "• For production deployment:"
echo "  - Set NEXT_PUBLIC_BACKEND_URL in frontend .env"
echo "  - Set FRONTEND_URL in backend .env"
echo ""
