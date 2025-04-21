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

// Basic HTTP endpoint (if needed)
app.get('/', (req, res) => {
  res.send('Modbus backend is running.');
});

app.get('/ip', (_, res) => {
  res.send(CONFIG.probeIp);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('change ip', async (data) => {
    await disconnect();
    CONFIG.probeIp = data;
    fs.writeFileSync('../config.json', JSON.stringify(CONFIG, null, 2));
    await connect(data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
