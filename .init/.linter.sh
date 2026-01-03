#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-classic-302548-302557/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

