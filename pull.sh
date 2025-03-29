#!/bin/bash
echo "🟢pulling code from github..."
sudo git pull
echo "🟢Applying code changes to sub modules..."

sudo git submodule update --init --recursive
echo -e "🟢Code Updated.✅"