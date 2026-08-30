#!/usr/bin/env python3
"""Store the Cloudflare Workers AI token without echoing or logging it."""

from __future__ import annotations

import getpass
import os
import tempfile
from pathlib import Path

ENV_PATH = Path(os.environ.get("HERMES_ENV_FILE", "/opt/data/.env"))
KEY = "CLOUDFLARE_API_TOKEN"


def update_env(path: Path, key: str, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = path.read_text(encoding="utf-8").splitlines() if path.exists() else []
    output: list[str] = []
    replaced = False

    for line in lines:
        if line.startswith(f"{key}="):
            if not replaced:
                output.append(f"{key}={value}")
                replaced = True
            continue
        output.append(line)

    if not replaced:
        output.append(f"{key}={value}")

    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".env.", dir=str(path.parent), text=True
    )
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w", encoding="utf-8") as temporary_file:
            temporary_file.write("\n".join(output) + "\n")
        os.replace(temporary_name, path)
        path.chmod(0o600)
    except Exception:
        try:
            os.unlink(temporary_name)
        except FileNotFoundError:
            pass
        raise


def main() -> None:
    token = getpass.getpass("Cloudflare API-Token (Eingabe bleibt unsichtbar): ").strip()
    if len(token) < 20 or any(character.isspace() for character in token):
        raise SystemExit("Token wirkt unvollständig. Es wurde nichts gespeichert.")
    update_env(ENV_PATH, KEY, token)
    print(f"Token sicher in {ENV_PATH} gespeichert; Dateirechte: 600.")


if __name__ == "__main__":
    main()
