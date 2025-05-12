from pydantic import BaseModel


class ConfigOutput(BaseModel):
    """
    Response type for config
    """

    probeIp: str
    legacy: bool