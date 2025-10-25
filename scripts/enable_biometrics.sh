#!/bin/bash

python3 /home/dac/free-sleep/scripts/is_biometrics_installed.py
result=$?

if [ $result -eq 0 ]; then
  echo "Biometrics environment not setup, continuing with installation..."
elif [ $result -eq 1 ]; then
  echo "Biometrics environment setup already, exiting!"
  exit 0
else
  echo "Unable to check if biometrics installed, exiting..."
  exit 1
fi


set -e  # Exit immediately if any command fails
set -o pipefail  # Catch errors in piped commands
set -u  # Treat unset variables as errors

RED='\033[0;31m'
NC='\033[0m' # No Color

# Catch any errors
trap '
  rc=$?;
  if [ "$rc" -ne 0 ]; then
    echo ""
    echo -e "${RED}Error enabling biometrics!${NC}"
    echo -e "${RED}Command that failed: $BASH_COMMAND - Exit code $rc ${NC}"
    echo ""
    curl -s -X POST http://127.0.0.1:3000/api/services \
      -H "Content-Type: application/json" \
      -d "{
        \"biometrics\": {
          \"jobs\": {
            \"installation\": {
              \"status\": \"failed\"
            }
          }
        }
      }"
  fi
  sh /home/dac/free-sleep/scripts/block_internet_access.sh
  exit $rc
' EXIT


sh /home/dac/free-sleep/scripts/unblock_internet_access.sh
sh /home/dac/free-sleep/scripts/setup_python.sh
sh /home/dac/free-sleep/scripts/install_python_packages.sh
sh /home/dac/free-sleep/scripts/setup_streamer_service.sh

# Mark the installation status as healthy
curl -X POST http://127.0.0.1:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "biometrics": {
      "jobs": {
        "installation": {
          "status": "healthy"
        }
      }
    }
  }'

sh /home/dac/free-sleep/scripts/block_internet_access.sh
cd /home/dac/free-sleep/biometrics/sleep_detection && /home/dac/venv/bin/python calibrate_sensor_thresholds.py

