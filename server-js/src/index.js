const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { pollModbus } = require('./modbus.js');
const CONFIG = require('./config.cjs');
const { initModbusStates } = require('./modbus-state');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS (adjust "origin" as needed in production)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const { actors } = initModbusStates(io);

let timeout = pollModbus(CONFIG.probeIp, 502, actors, io);

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
  const isPkg = typeof process.pkg !== 'undefined';
  const baseDir = isPkg
    ? // On Windows/Linux/Mac, this is the folder containing your .exe
      path.dirname(process.execPath)
    : // During dev, this is your src/ folder
      __dirname;
  const targetPath = path.join(baseDir, '../config.json');
  fs.writeFileSync(targetPath, JSON.stringify(CONFIG, null, 2), 'utf-8');

  timeout = pollModbus(probeIp, 502, actors, io, timeout);

  res.sendStatus(204);
});
app.post('/modbus-data', async (req, res) => {
  try {
    for (const actor of Object.values(actors)) {
      actor.send({ type: 'RETRIEVE' });
    }

    io.emit('connection', true);
    res.sendStatus(204);
  } catch {
    io.emit('connection', false);
    res.sendStatus(500);
  }
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
