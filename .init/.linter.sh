#!/bin/bash
cd /home/kavia/workspace/code-generation/music-streamer-platform-27497-27506/music_streaming_service_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

