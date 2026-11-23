#!/bin/bash
# Double-click to open the Momentum physics site in your browser.
# (YouTube videos only play when the site is served like this, not opened as a plain file.)
cd "$(dirname "$0")/docs" || exit 1
PORT=8765
( sleep 1 && open "http://localhost:$PORT" ) &
echo "Momentum is running at http://localhost:$PORT — close this window to stop it."
python3 -m http.server "$PORT"
