import e from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ADDRESS_TYPE, connect, readRegisters } from './modbus.js';
import { pollModbus } from './pollModbus.js';

const app = e();
const server = http.createServer(app);

// Configure Socket.IO with CORS (adjust "origin" as needed in production)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connect();

setInterval(async () => {
  // const dc = await readInputRegistersTo32BitFloats(4, 2, 1);

  // console.log(dc);

  // const probeSerial = await readInputRegistersToString(100, 6);

  // console.log(probeSerial);

  // io.emit('probe dc', JSON.stringify({ voltage: dc[0], current: dc[1] }));
  // const registers = await readRegisters(1, ADDRESS_TYPE.HOLDING_REGISTER, 2);

  // const buffer = Buffer.alloc(registers.length * 2);
  // registers.forEach((value, index) => {
  //   buffer.writeUInt16BE(value, index * 2);
  // });

  // const newDCSamplingRate = buffer.readFloatBE(0);

  // console.log(newDCSamplingRate);

  await pollModbus(io);
}, 1000);

// Basic HTTP endpoint (if needed)
app.get('/', (req, res) => {
  res.send('Modbus backend is running.');
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
