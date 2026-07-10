"""Convert spell_cards.csv to JSON and copy spell card images into the web app."""
from __future__ import annotations

import csv
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "spell_cards.csv"
IMAGES_SRC = ROOT / "extracted_images"
OUT_JSON = ROOT / "web" / "public" / "data" / "spells.json"
OUT_IMAGES = ROOT / "web" / "public" / "images"


def main() -> None:
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_IMAGES.mkdir(parents=True, exist_ok=True)

    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        spells = list(csv.DictReader(f))

    with OUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(spells, f, ensure_ascii=False, indent=2)
        f.write("\n")

    pngs = sorted(IMAGES_SRC.glob("*.png"))
    for src in pngs:
        shutil.copy2(src, OUT_IMAGES / src.name)

    print(f"spells.json count: {len(spells)}")
    print(f"images copied: {len(pngs)}")
    print(f"wrote {OUT_JSON}")
    print(f"copied to {OUT_IMAGES}")


if __name__ == "__main__":
    main()
