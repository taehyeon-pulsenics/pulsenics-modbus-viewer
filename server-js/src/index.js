import e from 'express';
import http from 'http';
import { Server } from 'socket.io';
import CONFIG from './config.cjs';
import fs from 'fs';
import cors from 'cors';
import { pollModbus } from './modbus.js';

const app = e();
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
app.use(e.json());

// Basic HTTP endpoint (if needed)
app.get('/', (req, res) => {
  res.send('Modbus backend is running.');
});

app.get('/config', (_, res) => {
  res.send(CONFIG);
});

app.post('/config', async (req, res) => {
  const body = req.body;

  if (
    body === undefined ||
    body.probeIp === undefined ||
    body.legacy === undefined
  ) {
    throw new Error('INCORRECT CONFIG');
  }

  CONFIG.probeIp = body.probeIp;
  CONFIG.legacy = body.legacy;
  fs.writeFileSync('../config.json', JSON.stringify(CONFIG, null, 2));

  timeout = pollModbus(body.probeIp, 502, io, timeout);

  res.send();
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
