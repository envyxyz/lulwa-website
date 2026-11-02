"""Remove the white background from the generated product images.

python scripts/cutout.py [names]   ->  design/generated/cutout/<name>.png (RGBA, same canvas)

Flood-fills near-white pixels connected to the border, so whites inside the appliance stay opaque.
The edge is feathered by blurring the mask a little, and edge colour is de-matted against white.
"""
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

NAMES = ['split-ac-indoor', 'window-ac', 'fridge', 'washer', 'dryer']
TOLERANCE = 30  # per channel, distance from 255
SRC = Path('design/generated')
OUT = SRC / 'cutout'


def background(rgb: Image.Image, tol: int) -> bytearray:
    w, h = rgb.size
    px = rgb.load()
    seen = bytearray(w * h)
    queue = deque()
    for x in range(w):
        queue.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        queue.extend([(0, y), (w - 1, y)])
    while queue:
        x, y = queue.popleft()
        if not (0 <= x < w and 0 <= y < h) or seen[y * w + x] or min(px[x, y]) < 255 - tol:
            continue
        seen[y * w + x] = 1
        queue.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return seen


def cutout(name: str) -> None:
    img = Image.open(SRC / f'{name}.png').convert('RGB')
    w, h = img.size
    bg = background(img, TOLERANCE)
    mask = Image.frombytes('L', (w, h), bytes(0 if b else 255 for b in bg))
    # Erode a pixel so the near-white fringe goes, then feather.
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    # Un-matte: pixels the mask partly covers were blended with white.
    px, mp = img.load(), mask.load()
    out = Image.new('RGBA', (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            a = mp[x, y]
            r, g, b = px[x, y]
            if 0 < a < 255:
                k = a / 255
                r, g, b = (max(0, min(255, round((c - 255 * (1 - k)) / k))) for c in (r, g, b))
            op[x, y] = (r, g, b, a)
    out.save(OUT / f'{name}.png', optimize=True)
    print(f'{name}: {w}x{h}, {100 * sum(bg) // (w * h)}% background')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['internals']:  # the cutaway illustrations live one folder down
        SRC = SRC / 'internals'
        OUT = SRC / 'cutout'
        args = args[1:]
    OUT.mkdir(parents=True, exist_ok=True)
    for n in args or NAMES:
        cutout(n)
