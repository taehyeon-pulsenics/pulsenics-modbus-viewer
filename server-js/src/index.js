const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { pollModbus } = require('./modbus.js');
const CONFIG = require('./config.cjs');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS (adjust "origin" as needed in production)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let timeout = pollModbus(CONFIG.probeIp, 502, io);

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

// Basic HTTP endpoint (if needed)
app.get('/', (req, res) => {
  res.send('Modbus backend is running.');
});

app.get('/config', (_, res) => {
  res.send(CONFIG);
});

app.post('/config', async (req, res) => {
  const { probeIp, legacy } = req.body ?? {};

  if (probeIp == null || legacy == null) {
    return res.status(400).send('INCORRECT CONFIG');
  }

  CONFIG.probeIp = probeIp;
  CONFIG.legacy = legacy;

  // write back to JSON file
  const targetPath = path.join(__dirname, '../config.json');
  fs.writeFileSync(targetPath, JSON.stringify(CONFIG, null, 2), 'utf-8');

  timeout = pollModbus(body.probeIp, 502, io, timeout);

  res.sendStatus(204);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
