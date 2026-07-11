"""Apply 2019 SotDL Revised Edition spell text updates to spells.json and spell_cards.csv."""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JSON_PATH = ROOT / "web" / "public" / "data" / "spells.json"
CSV_PATH = ROOT / "spell_cards.csv"

UPDATES: dict[str, dict[str, str]] = {
    "Harness Magic": {
        "duration": "See the effect",
        "description": (
            "Roll 1d6 + 3 to determine how many points of magical energy you harness. "
            "You retain these points until you complete a rest or you spend them. "
            "While you have points remaining, you cannot again cast harness magic. "
            "You can cast a spell you have learned by spending a number of points of magical "
            "energy equal to the rank of the spell (minimum 1) without expending a casting from that spell."
        ),
    },
    "Entropic Power": {
        "duration": "1 minute",
        "description": (
            "Take 3 damage. For the duration, creatures that take any damage from your attack spells "
            "take 1d6 extra damage. Triggered When you cast an attack spell that deals damage, you can "
            "use a triggered action to cast this spell, which ends at the end of the round. If the target "
            "takes damage from your spell, it takes 2d6 extra damage."
        ),
    },
    "Nightfall Blade": {
        "duration": "1 minute; see the effect",
        "description": (
            "Wisps of darkness form a solid blade in your hand that remains for the duration or until it "
            "leaves your hand. The blade functions as an off-hand swift weapon with the finesse property "
            "that deals 1d6 damage. It deals 1d6 extra damage when you get a success on an attack roll "
            "against a target in an area obscured by shadows or darkness. When you cast this spell, you "
            "can make an attack with the blade created by this spell."
        ),
    },
    "Acid Rain": {
        "area": "A cylinder, 2 yards tall with a 5-yard radius, centered on a point within long range",
        "duration": "1 minute",
        "description": (
            "Acidic green rain falls from clouds that spread through the area and remain for the duration, "
            "partially obscuring the area below. When you cast the spell, and at the end of each round for "
            "the duration, the rain deals 5d6 damage to each creature in the area that does not have shelter. "
            "Each creature that takes damage in this way must make a Strength challenge roll, taking half "
            "the damage on a success."
        ),
    },
    "Censure": {
        "area": "A sphere with a 5-yard radius centered on a point you can reach",
        "target": "",
        "duration": "",
        "description": (
            "You present your holy symbol, a bit of scripture, or some other physical representation of your "
            "faith, and release a wave of holy power that spreads through the area. Each demon, devil, faerie, "
            "spirit, or undead in the area must get a success on a Will challenge roll or become impaired for "
            "1 minute. When impaired in this way, a creature cannot take fast turns."
        ),
    },
    "Twain Self": {
        "area": (
            "A cube, large enough to hold a creature of your Size, originating from a point within a number "
            "of yards equal to your Speed"
        ),
        "description": (
            "You cause your self from the future to appear in the area and it remains in your time for the "
            "duration. Until the spell ends, you and your future self can each take a turn every round, though "
            "the paradox of your twained existence imposes 1 bane on both of your attack rolls and challenge "
            "rolls. You and your future self have identical attributes and characteristics. Although you can "
            "act separately, you and your future self count as one creature for sharing resources (damage, "
            "Insanity, castings, afflictions, and ongoing effects). Consumed or expended items are shared; a "
            "relic can be carried by only one of you. If either of you becomes incapacitated or dies, so does "
            "the other. When the spell ends, you disappear and reappear 1 minute later in your future self's space."
        ),
    },
    "Tidal Forces": {
        "target": "Any number of creatures within medium range",
        "description": (
            "Each target must make a Strength challenge roll with 1 bane. On a failure, it is moved 2d6 yards "
            "toward you or away from you (your choice) and becomes dazed for 1 round. On a success, it is just "
            "moved half the distance."
        ),
    },
}


def main() -> None:
    spells = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    updated = 0
    for spell in spells:
        patch = UPDATES.get(spell["name"])
        if not patch:
            continue
        for key, value in patch.items():
            spell[key] = value
        updated += 1
    JSON_PATH.write_text(json.dumps(spells, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    rows: list[dict[str, str]] = []
    with CSV_PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        for row in reader:
            patch = UPDATES.get(row.get("name", ""))
            if patch:
                for key, value in patch.items():
                    if key in row:
                        row[key] = value
            rows.append(row)
    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"updated_spells={updated}")


if __name__ == "__main__":
    main()
