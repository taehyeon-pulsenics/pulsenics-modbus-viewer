from pydantic import BaseModel


class ConfigInput(BaseModel):
    """
    Request body type for config
    """

    probeIp: str
    legacy: bool