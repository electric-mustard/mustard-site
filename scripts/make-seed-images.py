# Sample image generator — v1.0 — Made by Electric Mustard
# Makes the abstract placeholder images in public/seed/. Run once; the output
# is committed. Usage: python3 scripts/make-seed-images.py
import math
import os
import random

import numpy as np
from PIL import Image, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "seed")
os.makedirs(OUT, exist_ok=True)

PROJECTS = {
    "northwind": [(214, 142, 62), (56, 30, 18), (242, 226, 196)],
    "orbital": [(28, 32, 48), (112, 128, 190), (236, 240, 255)],
    "fjord": [(26, 60, 56), (142, 178, 160), (226, 232, 220)],
    "halo": [(240, 236, 228), (232, 185, 49), (36, 36, 40)],
    "meridian": [(108, 52, 46), (210, 150, 120), (248, 236, 224)],
}

SIZES = {
    "cover": (1200, 1500),
    "hero": (2400, 1500),
    "1": (2000, 1333),
    "2": (1600, 2000),
    "3": (2000, 1250),
}


def blob_image(size, palette, seed):
    rng = random.Random(seed)
    w, h = size
    # Work at a small scale and upscale for soft gradients.
    sw, sh = w // 8, h // 8
    yy, xx = np.mgrid[0:sh, 0:sw].astype(np.float32)
    xx /= sw
    yy /= sh

    base = np.array(palette[0], dtype=np.float32)
    img = np.ones((sh, sw, 3), dtype=np.float32) * base

    for _ in range(6):
        col = np.array(rng.choice(palette[1:]), dtype=np.float32)
        cx, cy = rng.random(), rng.random()
        rx, ry = 0.25 + rng.random() * 0.5, 0.25 + rng.random() * 0.5
        ang = rng.random() * math.pi
        dx, dy = xx - cx, yy - cy
        u = dx * math.cos(ang) + dy * math.sin(ang)
        v = -dx * math.sin(ang) + dy * math.cos(ang)
        d = (u / rx) ** 2 + (v / ry) ** 2
        a = np.clip(1.0 - d, 0, 1) ** 1.6
        a = a[..., None] * (0.55 + rng.random() * 0.45)
        img = img * (1 - a) + col * a

    # Diagonal light sweep
    sweep = np.clip((xx * 0.7 + yy * 0.3) * 1.2 - 0.2, 0, 1)[..., None]
    img = img * (0.86 + 0.28 * sweep)

    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")
    pil = pil.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(radius=w / 60))

    # Film grain
    grain = np.random.default_rng(seed).normal(0, 7, (h, w, 1)).astype(np.float32)
    arr = np.asarray(pil).astype(np.float32) + grain
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


for i, (slug, palette) in enumerate(PROJECTS.items()):
    for j, (name, size) in enumerate(SIZES.items()):
        img = blob_image(size, palette, seed=i * 100 + j)
        path = os.path.join(OUT, f"{slug}-{name}.jpg")
        img.save(path, "JPEG", quality=78, optimize=True, progressive=True)
        print(path, size)
