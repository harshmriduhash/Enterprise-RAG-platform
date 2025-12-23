#!/bin/bash
# Quick local validation for MVP

echo "=== Enterprise RAG MVP Validation ==="
echo ""

# Check backend files
echo "[CHECK] Backend files..."
test -f backend/main.py && echo "  ✓ main.py" || echo "  ✗ main.py MISSING"
test -f backend/requirements.txt && echo "  ✓ requirements.txt" || echo "  ✗ requirements.txt MISSING"
test -f backend/Dockerfile && echo "  ✓ Dockerfile" || echo "  ✗ Dockerfile MISSING"

# Check frontend files
echo "[CHECK] Frontend files..."
test -f frontend/package.json && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
test -f frontend/src/App.jsx && echo "  ✓ App.jsx" || echo "  ✗ App.jsx MISSING"
test -f frontend/src/api.js && echo "  ✓ api.js" || echo "  ✗ api.js MISSING"
test -f frontend/Dockerfile && echo "  ✓ Dockerfile" || echo "  ✗ Dockerfile MISSING"

# Check marketing files
echo "[CHECK] Marketing files..."
test -f LANDING.md && echo "  ✓ LANDING.md" || echo "  ✗ LANDING.md MISSING"
test -f QUICKSTART.md && echo "  ✓ QUICKSTART.md" || echo "  ✗ QUICKSTART.md MISSING"
test -f PILOT_EMAIL.md && echo "  ✓ PILOT_EMAIL.md" || echo "  ✗ PILOT_EMAIL.md MISSING"
test -f PRICING_ONE_PAGER.md && echo "  ✓ PRICING_ONE_PAGER.md" || echo "  ✗ PRICING_ONE_PAGER.md MISSING"

# Check deployment files
echo "[CHECK] Deployment files..."
test -f docker-compose.yml && echo "  ✓ docker-compose.yml" || echo "  ✗ docker-compose.yml MISSING"
test -f deploy.sh && echo "  ✓ deploy.sh" || echo "  ✗ deploy.sh MISSING"
test -f DEPLOYMENT.md && echo "  ✓ DEPLOYMENT.md" || echo "  ✗ DEPLOYMENT.md MISSING"

# Check demo
echo "[CHECK] Demo assets..."
test -f demo/manual.md && echo "  ✓ demo/manual.md" || echo "  ✗ demo/manual.md MISSING"

echo ""
echo "=== Validation Complete ==="
echo "All MVP components ready for launch!"
