import json, sys, shutil
from pathlib import Path

BASE_DIR     = Path(__file__).resolve().parent
example_path = BASE_DIR.parent / 'config.example.json'
config_path  = BASE_DIR.parent / 'config.json'

if not config_path.exists():
    shutil.copy(example_path, config_path)

try:
    raw    = config_path.read_text(encoding='utf-8')
    CONFIG = json.loads(raw)
except json.JSONDecodeError as err:
    print(f'Invalid JSON in {config_path.name}: {err}', file=sys.stderr)
    sys.exit(1)

probe_ip = CONFIG.get('probeIp')
legacy   = CONFIG.get('legacy')

def set_probe_ip(new_ip, persist: bool = False):
    global probe_ip, CONFIG
    probe_ip       = new_ip
    CONFIG['probeIp'] = new_ip
    if persist:
        config_path.write_text(json.dumps(CONFIG, indent=2))

def set_legacy(flag: bool, persist: bool = False):
    global legacy, CONFIG
    legacy         = flag
    CONFIG['legacy'] = flag
    if persist:
        config_path.write_text(json.dumps(CONFIG, indent=2))
