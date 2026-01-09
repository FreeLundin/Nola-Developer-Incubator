"""
Unreal Editor utility (Python) - small script demonstrating how to poll /mcp/controls
and write a Blueprint-compatible JSON file that an Unreal Editor script/plugin could consume.

This is intended to run on the host machine where Unreal Editor can read the output.
"""
import requests
import time
import json
import os

MCP_URL = os.environ.get('MCP_URL','http://localhost:4004/mcp/controls')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'mcp', 'blueprints')
os.makedirs(OUT_DIR, exist_ok=True)

def fetch_and_write():
    try:
        r = requests.get(MCP_URL, timeout=2.0)
        r.raise_for_status()
        data = r.json()
        name = 'controls_preset'
        out = {
            'name': name,
            'variables': data
        }
        out_path = os.path.join(OUT_DIR, f'{name}.json')
        with open(out_path, 'w') as f:
            json.dump(out, f, indent=2)
        print('Wrote', out_path)
    except Exception as e:
        print('Fetch/write failed:', e)

if __name__ == '__main__':
    print('Polling', MCP_URL)
    while True:
        fetch_and_write()
        time.sleep(3.0)
