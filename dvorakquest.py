#!/usr/bin/env python3
"""
DvorakQuest — Lokaler Spiel-Server & Starter
Startet einen leichtgewichtigen lokalen Webserver (ohne externe Abhängigkeiten),
speichert deinen Spielfortschritt unter data/progress.json und öffnet DvorakQuest im Browser.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import socket
import sys
import threading
import webbrowser
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "web"
DATA_DIR = BASE_DIR / "data"
PROGRESS_FILE = DATA_DIR / "progress.json"


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        try:
            return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_progress(payload: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    tmp_file = PROGRESS_FILE.with_suffix(".tmp")
    tmp_file.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    tmp_file.replace(PROGRESS_FILE)


class DvorakQuestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def log_message(self, format: str, *args) -> None:
        pass

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path.split("?")[0] == "/api/progress":
            data = json.dumps(load_progress(), ensure_ascii=False).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path.split("?")[0] == "/api/progress":
            try:
                length = int(self.headers.get("Content-Length", "0"))
                raw = self.rfile.read(min(length, 1_000_000))
                payload = json.loads(raw.decode("utf-8"))
                if isinstance(payload, dict):
                    save_progress(payload)
                resp = b'{"ok":true}'
                self.send_response(HTTPStatus.OK)
            except Exception:
                resp = b'{"ok":false}'
                self.send_response(HTTPStatus.BAD_REQUEST)

            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        self.send_error(HTTPStatus.NOT_FOUND)


def find_free_port(preferred: int = 8766) -> int:
    for port in [preferred, *range(preferred + 1, preferred + 50)]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def main() -> int:
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")

    parser = argparse.ArgumentParser(description="DvorakQuest — Spielend Deutsch-Dvorak lernen")
    parser.add_argument("--port", type=int, default=8766, help="Bevorzugter Port (Standard: 8766)")
    parser.add_argument("--no-browser", action="store_true", help="Browser nicht automatisch öffnen")
    args = parser.parse_args()

    port = find_free_port(args.port)
    url = f"http://127.0.0.1:{port}"

    server = ThreadingHTTPServer(("127.0.0.1", port), DvorakQuestHandler)

    print("\n" + "═" * 60)
    print("  🦅  DvorakQuest — Spielend die Deutsche Dvorak-Tastatur lernen")
    print("═" * 60)
    print(f"  🌐 Spiel läuft unter:  {url}")
    print(f"  💾 Spielstand-Datei:   {PROGRESS_FILE}")
    print("  🛑 Beenden jederzeit:  Strg + C")
    print("═" * 60 + "\n")

    if not args.no_browser:
        threading.Timer(0.25, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 DvorakQuest beendet — bis zum nächsten Training!")
    finally:
        server.server_close()

    return 0


if __name__ == "__main__":
    sys.exit(main())

