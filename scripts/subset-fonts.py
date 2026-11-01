"""Subset the three OFL families into public/fonts, print sizes and fallback metrics.
Usage: python scripts/subset-fonts.py <dir with raw ttf and OFL files from github.com/google/fonts/tree/main/ofl>
Needs: pip install fonttools brotli
"""
import io, pathlib, shutil, sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

src = pathlib.Path(sys.argv[1])
out = pathlib.Path("public/fonts")
(out / "licenses").mkdir(parents=True, exist_ok=True)

# Saudi Arabic only: letters, harakat, Arabic digits and punctuation. Presentation forms come in through GSUB.
ARABIC = [0x060C, 0x061B, 0x061F, *range(0x0621, 0x063B), *range(0x0640, 0x0653), *range(0x0660, 0x066E), 0x0670, 0x067E, 0x0686, 0x06A9, 0x06AF, 0x06CC]
FEATURES = ["ccmp", "locl", "isol", "init", "medi", "fina", "rlig", "liga", "calt", "mark", "mkmk", "kern"]
MARKS = [0x200C, 0x200D, 0x200E, 0x200F, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026]
ASCII = list(range(0x20, 0x7F))
LATIN = [*ASCII, *range(0xA0, 0x100), 0x2019, 0x2013, 0x2014, 0x201C, 0x201D, 0x2026, 0x2192, 0x2190]
# Plex carries Latin words and digits inside Arabic text; Beiruti only ever sets Arabic headlines and digits.
JOBS = [
    ("Beiruti.ttf", "beiruti-800-900.woff2", ARABIC + MARKS + list(range(0x30, 0x3A)) + [0x20, 0x2E, 0x2C, 0x3F, 0x21], {"wght": (800, 900)}),
    ("Plex-Regular.ttf", "plex-arabic-400.woff2", ARABIC + MARKS + ASCII, None),
    ("Plex-Medium.ttf", "plex-arabic-500.woff2", ARABIC + MARKS + ASCII, None),
    ("Schibsted.ttf", "schibsted-400-800.woff2", LATIN, {"wght": (400, 800)}),
]

total = 0
for raw, name, unicodes, limits in JOBS:
    font = TTFont(src / raw)
    if limits:
        font = instancer.instantiateVariableFont(font, limits)
        buffer = io.BytesIO()  # subsetter needs gvar reloaded after instancing
        font.save(buffer)
        buffer.seek(0)
        font = TTFont(buffer)
    options = subset.Options(flavor="woff2", layout_features=FEATURES, notdef_outline=True)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(out / name)
    size = (out / name).stat().st_size
    total += size
    print(f"{name}: {size / 1024:.1f} KB")
print(f"total: {total / 1024:.1f} KB (budget 110)")

for family in ("Beiruti", "Plex", "Schibsted"):
    shutil.copy(src / f"{family}-OFL.txt", out / "licenses" / f"{family}-OFL.txt")

# size-adjust for the local fallback = web font width / fallback width over sample text.
def width(font, text):
    cmap, hmtx = font.getBestCmap(), font["hmtx"]
    return sum(hmtx[cmap[ord(c)]][0] for c in text if ord(c) in cmap) / font["head"].unitsPerEm

AR = "المكيف وقف نجيك لحد بيتك صيانة تكييف وتبريد الدمام"
EN = "AC gave up? We come to you. Repair in Dammam, fridges and washers"
fallbacks = pathlib.Path("C:/Windows/Fonts")
for raw, sample, fb in (("Beiruti.ttf", AR, "tahoma.ttf"), ("Plex-Regular.ttf", AR, "tahoma.ttf"), ("Schibsted.ttf", EN, "arial.ttf")):
    print(f"{raw} over {fb}: size-adjust {width(TTFont(src / raw), sample) / width(TTFont(fallbacks / fb), sample) * 100:.1f}%")
