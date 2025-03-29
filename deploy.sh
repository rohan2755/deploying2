#!/bin/bash

echo "Pulling the latest code..."
sudo bash pull.sh

sudo docker compose up -d --build

echo "🟩 Deployment Done. ✅"
