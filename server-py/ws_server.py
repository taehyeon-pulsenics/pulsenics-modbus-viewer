import socketio
from fastapi import Depends, HTTPException, status

sio_server = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*', methods=["GET", "POST"],)
sio_app = socketio.ASGIApp(socketio_server=sio_server)

@sio_server.event
async def connect(sid, environ, auth):
    print('a user connected')

@sio_server.event
async def disconnect(sid):
    print('user disconnected')