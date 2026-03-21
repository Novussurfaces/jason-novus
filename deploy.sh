#!/bin/bash
# Novus Surfaces Deploy Script — VPS 72.60.26.85
# Usage: bash deploy.sh

set -e

VPS_USER="root"
VPS_HOST="72.60.26.85"
VPS_KEY="/c/Users/lanth/.ssh/vps_key"
REMOTE_DIR="/opt/novus-surfaces"

echo "=== Novus Surfaces Deploy ==="

# 1. Build locally to verify
echo "[1/5] Building locally..."
npm run build

# 2. Create tar (exclude heavy dirs)
echo "[2/5] Creating archive..."
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    -czf /tmp/novus-surfaces.tar.gz .

# 3. Upload to VPS
echo "[3/5] Uploading to VPS..."
ssh -i "$VPS_KEY" "$VPS_USER@$VPS_HOST" "mkdir -p $REMOTE_DIR"
scp -i "$VPS_KEY" /tmp/novus-surfaces.tar.gz "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"

# 4. Build and run on VPS
echo "[4/5] Building Docker image on VPS..."
ssh -i "$VPS_KEY" "$VPS_USER@$VPS_HOST" <<'REMOTE'
cd /opt/novus-surfaces
tar -xzf novus-surfaces.tar.gz
rm novus-surfaces.tar.gz

# Stop existing container if running
docker stop novus-surfaces 2>/dev/null || true
docker rm novus-surfaces 2>/dev/null || true

# Build and run
docker build -t novus-surfaces .
docker run -d \
  --name novus-surfaces \
  --restart unless-stopped \
  -p 3001:3000 \
  -e NODE_ENV=production \
  -e OLLAMA_URL=http://100.83.113.25:11434/api/chat \
  novus-surfaces

echo "Container running on port 3001"
docker ps | grep novus-surfaces
REMOTE

# 5. Setup nginx (first time only)
echo "[5/5] Configuring nginx..."
scp -i "$VPS_KEY" nginx/novussurfaces.com.conf "$VPS_USER@$VPS_HOST:/etc/nginx/sites-available/novussurfaces.com"
ssh -i "$VPS_KEY" "$VPS_USER@$VPS_HOST" <<'REMOTE'
ln -sf /etc/nginx/sites-available/novussurfaces.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
echo "Nginx configured and reloaded"
REMOTE

echo "=== Deploy complete! ==="
echo "Site: http://$VPS_HOST:3001"
echo "Domain: https://novussurfaces.com (after DNS setup)"
