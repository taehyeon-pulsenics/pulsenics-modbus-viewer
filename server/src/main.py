
import socketio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ws_server import sio_server

from modbus_reader.ModbusReader import ModbusReader

import config
from custom_types import api_request_types

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

sio_app = socketio.ASGIApp(socketio_server=sio_server, other_asgi_app=app)

modbus_reader = ModbusReader(config.probe_ip, config.legacy, sio=sio_server)

modbus_reader.create_poll_thread().start()

@app.get("/")
def hello_world():
    return {'Modbus backend is running.'}

@app.get('/config')
def get_config():
    return {
        "probeIp": config.probe_ip,
        "legacy": config.legacy
    }

@app.post('/config')
def post_config(input: api_request_types.ConfigInput):
    config.set_probe_ip(input.probeIp, persist=True)
    config.set_legacy(input.legacy, persist=True)

    modbus_reader.update_config(input)

    return {}


def serve():
    """Serve the API"""
    uvicorn.run(sio_app, port=3000)


if __name__ == "__main__":
    serve()