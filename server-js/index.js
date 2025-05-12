import e from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connect, disconnect } from './modbus.js';
import { pollModbus } from './pollModbus.js';
import CONFIG from './config.cjs';
import fs from 'fs';
import cors from 'cors';

const app = e();
const server = http.createServer(app);

// Configure Socket.IO with CORS (adjust "origin" as needed in production)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connect(CONFIG.probeIp);

setInterval(async () => {
  await pollModbus(io);
}, 1000);

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

  await disconnect();

  CONFIG.probeIp = body.probeIp;
  CONFIG.legacy = body.legacy;
  fs.writeFileSync('../config.json', JSON.stringify(CONFIG, null, 2));

  await connect(CONFIG.probeIp);

  res.send();
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('change ip', async (data) => {
    await disconnect();
    CONFIG.probeIp = data;
    fs.writeFileSync('../config.json', JSON.stringify(CONFIG, null, 2));
    await connect(CONFIG.probeIp);
  });
  socket.on('change legacy', async (data) => {
    CONFIG.legacy = !!new Uint16Array(data)[0];
    console.log(CONFIG);
    fs.writeFileSync('../config.json', JSON.stringify(CONFIG, null, 2));
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
