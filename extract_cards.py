"""Extract SotDL spell cards from tradition PDFs into CSV + PNGs."""
from __future__ import annotations

import csv
import re
from pathlib import Path

import fitz  # PyMuPDF

CARDS_DIR = Path(r"E:\Trove 2.0\Vault2.0.-.TTRPG-Gamebooks\Shadow of the Demon Lord\Cards")
OUT_DIR = Path(__file__).resolve().parent
IMAGES_DIR = OUT_DIR / "extracted_images"
CSV_PATH = OUT_DIR / "spell_cards.csv"

TRADITIONS: dict[str, str] = {
    "Arcana": "Intellect",
    "Battle": "Intellect",
    "Conjuration": "Intellect",
    "Curse": "Intellect",
    "Divination": "Intellect",
    "Enchantment": "Intellect",
    "Forbidden": "Intellect",
    "Illusion": "Intellect",
    "Necromancy": "Intellect",
    "Protection": "Intellect",
    "Rune": "Intellect",
    "Shadow": "Intellect",
    "Technomancy": "Intellect",
    "Teleportation": "Intellect",
    "Time": "Intellect",
    "Air": "Will",
    "Alteration": "Will",
    "Celestial": "Will",
    "Chaos": "Will",
    "Destruction": "Will",
    "Earth": "Will",
    "Fire": "Will",
    "Life": "Will",
    "Nature": "Will",
    "Primal": "Will",
    "Song": "Will",
    "Storm": "Will",
    "Theurgy": "Will",
    "Transformation": "Will",
    "Water": "Will",
}

DARK_MAGIC = {"Curse", "Forbidden", "Necromancy"}
HEADER_LABELS = ("Area", "Target", "Duration", "Requirement")

KIND_RE = re.compile(r"^(Attack|Utility)\s+(\d+)\s*$", re.IGNORECASE)
BOOK_RE = re.compile(r"^([A-Za-z][A-Za-z0-9' \-]{0,40}?)\s+(\d+)\s*$")
COPYRIGHT_RE = re.compile(r"Shadow of the Demon Lord", re.IGNORECASE)
ART_RE = re.compile(r"^(ART AREA|LIVE AREA)\b", re.IGNORECASE)

# Require real junk chars before remnant (avoid eating normal words).
LIGATURE_FIXES: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*ammable\b"), "flammable"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*ames\b"), "flames"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*ame\b"), "flame"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*icker\b"), "flicker"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*ying\b"), "flying"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*esh\b"), "flesh"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*oor\b"), "floor"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*ow(ing|ed|s)?\b"), r"flow\1"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*ood(s|ed|ing)?\b"), r"flood\1"),
    (re.compile(r"[^\x20-\x7E]{1,6}[, ]*y\b"), "fly"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*re\b"), "fire"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*ery\b"), "fiery"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*eld(s|ed|ing)?\b"), r"field\1"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*rst\b"), "first"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*lls\b"), "fills"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*ll(ed|ing|s)?\b"), r"fill\1"),
    (re.compile(r"[^\x20-\x7E]{1,6}[? ]*nd(s|ing|er)?\b"), r"find\1"),
]

TH_FIXES = {
    r"\bT e temperate\b": "The temperature",
    r"\bT e\b": "The",
    r"\bT is\b": "This",
    r"\bT at\b": "That",
    r"\bT en\b": "Then",
    r"\bT ey\b": "They",
    r"\bT ere\b": "There",
    r"\bT ese\b": "These",
    r"\bT eir\b": "Their",
    r"\bT em\b": "Them",
    r"\bT rough\b": "Through",
    r"\bT row\b": "Throw",
    r"\bT underclap\b": "Thunderclap",
    r"\bT under\b": "Thunder",
}


def tradition_from_filename(name: str) -> str | None:
    m = re.search(r"SotDL\s*-\s*Spell Cards\s*-\s*(.+)\.pdf$", name, re.IGNORECASE)
    if not m:
        return None
    tradition = m.group(1).strip()
    return tradition if tradition in TRADITIONS else None


def fix_text(text: str) -> str:
    if not text:
        return text

    text = text.replace("\u00a0", " ")
    text = text.replace("\ufb01", "fi").replace("\ufb02", "fl")
    text = text.replace("\ufb00", "ff").replace("\ufb03", "ffi").replace("\ufb04", "ffl")

    # Possessives: target�?Ts / target�s -> target's
    text = re.sub(r"[^\x20-\x7E]{1,4}\?T", "'", text)
    text = re.sub(r"[^\x20-\x7E]+s\b", "'s", text)

    for pat, repl in LIGATURE_FIXES:
        text = pat.sub(repl, text)

    for pat, repl in TH_FIXES.items():
        text = re.sub(pat, repl, text)

    # Leftover split ligatures: "fl ames", "fi re", "fl y"
    text = re.sub(r"\bfl ([a-z])", r"fl\1", text)
    text = re.sub(r"\bfi ([a-z])", r"fi\1", text)
    text = re.sub(r"\bff ([a-z])", r"ff\1", text)

    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    return value.strip("_") or "card"


def page_blocks(page: fitz.Page) -> list[tuple[float, str]]:
    items: list[tuple[float, str]] = []
    for b in page.get_text("blocks"):
        if b[6] != 0:
            continue
        t = b[4].replace("\x00", "").strip()
        if not t:
            continue
        items.append((float(b[1]), t))
    items.sort(key=lambda x: (round(x[0], 1), x[1]))
    return items


def is_description_start(line: str) -> bool:
    return bool(
        re.match(
            r"^(You|Make|A |An |The |Each |Creatures|While|On a|This|Choose|Until|As |At |For |When |If |Roll |Attack Roll|Triggered)\b",
            line,
        )
    )


def parse_labeled_fields(body: str) -> dict[str, str]:
    fields = {lab.lower(): "" for lab in HEADER_LABELS}
    lines = [ln.strip() for ln in body.splitlines() if ln.strip()]
    if not lines:
        return {**fields, "description": ""}

    short_labels = {"Duration", "Requirement"}
    # Only lowercase connector/wrap starts count as field continuations.
    cont_ok = re.compile(
        r"^(point|within|or|and|from|to|of|in|on|at|with|your|its|their|originating|centered|that|who|which)\b"
    )

    i = 0
    while i < len(lines):
        line = lines[i]
        matched_label = None
        for lab in HEADER_LABELS:
            if re.match(rf"^{lab}\b", line, re.IGNORECASE):
                matched_label = lab
                break
        if not matched_label:
            break

        value = line[len(matched_label) :].strip()
        j = i + 1
        while j < len(lines):
            nxt = lines[j]
            if any(re.match(rf"^{x}\b", nxt, re.IGNORECASE) for x in HEADER_LABELS):
                break
            if re.match(r"^(Triggered|Attack Roll)\b", nxt, re.IGNORECASE):
                break
            if matched_label in short_labels:
                if re.match(r"^[A-Z]", nxt):
                    break
            else:
                if is_description_start(nxt):
                    break
                if re.match(r"^[A-Z]", nxt) and not cont_ok.match(nxt):
                    # Capitalized wrap that's not a known connector -> description
                    break
                if not cont_ok.match(nxt) and not re.match(r"^[a-z]", nxt):
                    break
            value = f"{value} {nxt}".strip()
            j += 1

        fields[matched_label.lower()] = fix_text(value)
        i = j

    description = fix_text(" ".join(lines[i:]))
    description = re.sub(r"\s+", " ", description).strip()
    fields["description"] = description
    return fields


def extract_book_page(blocks: list[tuple[float, str]]) -> tuple[str, str]:
    book = ""
    page_number = ""
    for y, raw in blocks:
        probe = re.sub(r"[ \t]+", " ", raw).strip()
        if not COPYRIGHT_RE.search(probe):
            continue
        for line in probe.splitlines():
            line = line.strip()
            if not line or COPYRIGHT_RE.search(line):
                continue
            bm = BOOK_RE.match(line)
            if bm:
                return bm.group(1).strip(), bm.group(2)
    # Fallback: last book-like line near bottom
    for y, raw in reversed(blocks):
        if y < 180:
            break
        for line in raw.splitlines():
            line = re.sub(r"[ \t]+", " ", line).strip()
            if COPYRIGHT_RE.search(line) or KIND_RE.match(line) or ART_RE.match(line):
                continue
            bm = BOOK_RE.match(line)
            if bm and bm.group(1).strip().lower() not in {"attack", "utility"}:
                return bm.group(1).strip(), bm.group(2)
    return book, page_number


def parse_card_page(page: fitz.Page) -> dict[str, str] | None:
    blocks = page_blocks(page)
    if not blocks:
        return None

    kind = ""
    level = ""
    name = ""
    body_parts: list[str] = []

    for y, raw in blocks:
        raw = raw.replace("\x00", "").strip()
        if not raw:
            continue
        probe = re.sub(r"[ \t]+", " ", raw).strip()

        if ART_RE.match(probe):
            continue
        if COPYRIGHT_RE.search(probe):
            continue

        km = KIND_RE.match(probe)
        if km and y > 180:
            kind = km.group(1).upper()
            level = km.group(2)
            continue

        bm = BOOK_RE.match(probe)
        if bm and y > 180 and bm.group(1).strip().lower() not in {"attack", "utility"}:
            continue

        if not name and y < 35:
            name = fix_text(probe.splitlines()[0].strip())
            continue

        body_parts.append(fix_text(probe))

    if not name or not kind:
        return None

    book, page_number = extract_book_page(blocks)
    # Water (and rare) decks omit book/page from the text layer; core table
    # traditions are from the Shadow of the Demon Lord rulebook.
    if not book:
        book = "SHADOW"
    fields = parse_labeled_fields("\n".join(body_parts))

    return {
        "name": name,
        "area": fields.get("area", ""),
        "target": fields.get("target", ""),
        "duration": fields.get("duration", ""),
        "requirement": fields.get("requirement", ""),
        "description": fields.get("description", ""),
        "utility_or_attack": kind,
        "book": book.upper(),
        "page_number": page_number,
        "spell_level": level,
    }


def main() -> int:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    for old in IMAGES_DIR.glob("*.png"):
        old.unlink()

    rows: list[dict[str, str]] = []
    skipped_files: list[str] = []
    processed_files: list[str] = []
    skipped_pages = 0

    for pdf_path in sorted(CARDS_DIR.glob("*.pdf")):
        tradition = tradition_from_filename(pdf_path.name)
        if tradition is None:
            skipped_files.append(pdf_path.name)
            continue
        processed_files.append(pdf_path.name)
        attr = TRADITIONS[tradition]
        dark = "yes" if tradition in DARK_MAGIC else "no"

        doc = fitz.open(pdf_path)
        for page_index, page in enumerate(doc):
            parsed = parse_card_page(page)
            if not parsed:
                skipped_pages += 1
                continue

            image_name = (
                f"{slugify(tradition)}_{slugify(parsed['name'])}_p{page_index + 1:02d}.png"
            )
            image_rel = f"extracted_images/{image_name}"
            pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), alpha=False)
            pix.save(IMAGES_DIR / image_name)

            rows.append(
                {
                    "tradition": tradition,
                    "attribute": attr,
                    "dark_magic": dark,
                    "name": parsed["name"],
                    "area": parsed["area"],
                    "target": parsed["target"],
                    "duration": parsed["duration"],
                    "requirement": parsed["requirement"],
                    "description": parsed["description"],
                    "utility_or_attack": parsed["utility_or_attack"],
                    "book": parsed["book"],
                    "page_number": parsed["page_number"],
                    "spell_level": parsed["spell_level"],
                    "image_path": image_rel,
                    "source_pdf": pdf_path.name,
                    "pdf_page": str(page_index + 1),
                }
            )
        doc.close()

    fieldnames = [
        "tradition",
        "attribute",
        "dark_magic",
        "name",
        "area",
        "target",
        "duration",
        "requirement",
        "description",
        "utility_or_attack",
        "book",
        "page_number",
        "spell_level",
        "image_path",
        "source_pdf",
        "pdf_page",
    ]
    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    qa_names = {
        "Stir the Air",
        "Wind Blast",
        "Hex",
        "Celerity",
        "Control Flame",
        "Still the Air",
        "Bind Air Genie",
        "Bestow Flight",
    }
    lines = [
        f"processed_pdfs={len(processed_files)}",
        f"skipped_pdfs={len(skipped_files)}",
        f"cards={len(rows)}",
        f"skipped_pages={skipped_pages}",
        f"images={len(list(IMAGES_DIR.glob('*.png')))}",
        f"empty_book={sum(1 for r in rows if not r['book'])}",
        f"empty_page={sum(1 for r in rows if not r['page_number'])}",
        f"empty_description={sum(1 for r in rows if not r['description'])}",
        "",
        "QA SAMPLES:",
    ]
    for r in rows:
        if r["name"] in qa_names:
            lines.append(
                f"- {r['name']}: {r['utility_or_attack']} {r['spell_level']} | "
                f"{r['book']} {r['page_number']} | area={r['area']!r} | "
                f"target={r['target']!r} | duration={r['duration']!r} | "
                f"desc={r['description'][:100]!r}"
            )
    empty_books = [f"{r['tradition']}:{r['name']}" for r in rows if not r["book"]]
    lines += ["", "EMPTY BOOK ROWS:", *empty_books, "", "SKIPPED FILES:", *skipped_files]
    (OUT_DIR / "extraction_summary.txt").write_text("\n".join(lines), encoding="utf-8")
    print(f"OK cards={len(rows)} images={len(list(IMAGES_DIR.glob('*.png')))}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
