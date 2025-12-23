#!/bin/bash
# Deploy Enterprise RAG MVP to Linux VM (assumes Ubuntu 22.04)

set -e

echo "[DEPLOY] Installing dependencies..."
sudo apt-get update
sudo apt-get install -y curl docker.io docker-compose-plugin git

echo "[DEPLOY] Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker

echo "[DEPLOY] Cloning/pulling repo..."
REPO_DIR="/opt/rag-mvp"
if [ ! -d "$REPO_DIR" ]; then
  sudo mkdir -p "$REPO_DIR"
  sudo chown $USER:$USER "$REPO_DIR"
fi

echo "[DEPLOY] Building and running containers..."
cd "$REPO_DIR"
docker compose up -d --build

echo "[DEPLOY] Waiting for backend to be ready..."
sleep 10

echo "[DEPLOY] Creating systemd service for auto-restart..."
sudo tee /etc/systemd/system/rag-mvp.service > /dev/null <<EOF
[Unit]
Description=Enterprise RAG MVP
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=/bin/bash -c "cd $REPO_DIR && docker compose up -d"
ExecStop=/bin/bash -c "cd $REPO_DIR && docker compose down"
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable rag-mvp.service
sudo systemctl start rag-mvp.service

echo "[DEPLOY] ✓ Backend running at http://localhost:8000"
echo "[DEPLOY] ✓ Frontend running at http://localhost:5173"
echo "[DEPLOY] Set environment variables in docker-compose.yml: MVP_JWT_SECRET, OPENAI_API_KEY"
