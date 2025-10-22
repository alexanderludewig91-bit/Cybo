// WebSocket Server für Cybo Extension
const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = 3001;

// Erstelle HTTP Server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Cybo WebSocket Server läuft');
});

// WebSocket Server
const wss = new WebSocketServer({ 
  server,
  verifyClient: (info) => {
    console.log('🔍 WebSocket Verbindungsversuch von:', info.origin);
    return true; // Akzeptiere alle
  }
});

let clients = new Set();
let latestData = null;

wss.on('connection', (ws, req) => {
  console.log('✅ Neue Verbindung von:', req.headers.origin || 'Unbekannt');
  console.log('   URL:', req.url);
  console.log('   Total Clients:', clients.size + 1);
  clients.add(ws);
  
  // Sende letzte Daten an neuen Client
  if (latestData) {
    ws.send(JSON.stringify(latestData));
  }
  
  ws.on('message', (data) => {
    try {
      // Konvertiere Buffer/Blob zu String
      const messageString = data.toString();
      const message = JSON.parse(messageString);
      console.log('📨 Nachricht empfangen:', message.type);
      
      // Handle Dashboard-Commands (sende an Extension)
      if (message.type === 'DASHBOARD_COMMAND') {
        console.log('🎮 Dashboard-Command:', message.command);
        // Leite Command an Extension weiter (alle Clients außer Sender)
        const commandData = JSON.stringify(message);
        clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(commandData);
          }
        });
        return; // Nicht als latestData speichern
      }
      
      // Speichere letzte Daten (aber nur wenn es keine localhost-URL ist)
      if (message.payload && message.payload.url) {
        const url = message.payload.url;
        // Ignoriere localhost-URLs im Broadcast
        if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
          latestData = message;
        }
      } else if (message.type === 'WEBSITE_DATA') {
        latestData = message;
      }
      
      // Broadcast an alle Clients (Dashboard) - als String!
      const broadcastData = JSON.stringify(message);
      clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(broadcastData); // Als String senden!
        }
      });
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Nachricht:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('❌ Client getrennt. Verbleibend:', clients.size - 1);
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
  });
});

wss.on('error', (error) => {
  console.error('🔴 WebSocket Server Fehler:', error);
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket Server läuft auf Port ${PORT}`);
  console.log(`   HTTP: http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
});

