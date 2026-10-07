CITIRIZINE V13 - ONE-URL MULTIPLAYER WEB BUILD

WHAT THIS VERSION DOES
- Serves the game and WebSocket multiplayer from the same website/port.
- Uses HTTPS/WSS automatically when deployed behind a secure host.
- Other players can open the same public URL and join the same classroom.
- Chat and player movement are synchronized through the Node.js server.
- Spacebar and other text characters work inside text fields because game hotkeys are ignored while typing.

RECOMMENDED DEPLOYMENT: RENDER
1. Put this folder in a GitHub repository.
2. Create a new Web Service on Render and connect that repository.
3. Render can detect render.yaml, or use:
   Build command: npm ci --omit=dev
   Start command: npm start
4. After deployment, Render gives you one HTTPS URL such as:
   https://citirizine-xxxx.onrender.com
5. Send that URL to your friends. Everyone opening the same URL joins the same server.

IMPORTANT
- The current account/password screen is a prototype identity screen, not real secure authentication. Do not use a real password.
- Player data is held in server memory. Restarting the service clears the current room.
- The server is authoritative only for the basic multiplayer snapshot in this prototype. Admin commands and persistence still need a production backend if you want a fully persistent game.
- Free hosting may sleep when nobody is using it, so the first visit after inactivity can take a little longer.

LOCAL TEST
1. Install Node.js 18+.
2. Run: npm install
3. Run: npm start
4. Open: http://localhost:3000
5. Open the same URL in another browser/device on a reachable server to test multiplayer.
