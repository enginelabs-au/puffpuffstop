#!/usr/bin/env python3
"""Prepare App Store creative assets from a marketing image.

Exports:
- Universal header/search image: 5244x2950 PNG, no transparency
- Product-page header: 3840x1646 PNG, no transparency
- Optional 1:1 screen assets for a three-up layout

Screen pixels are only scaled uniformly. The backdrop is a single sampled purple.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

UNIVERSAL = (5244, 2950, (1921, 660, 1402, 962))
HEADER = (3840, 1646, (1097, 492, 1646, 661))
SQUARE = 1080
BRAND_PURPLE = np.array([48, 29, 69], dtype=np.uint8)


def sample_background(image: np.ndarray) -> np.ndarray:
    h, w, _ = image.shape
    corners = np.concatenate(
        [
            image[:48, :48].reshape(-1, 3),
            image[:48, -48:].reshape(-1, 3),
            image[-48:, :48].reshape(-1, 3),
            image[-48:, -48:].reshape(-1, 3),
        ]
    )
    guess = np.median(corners, axis=0)
    distance = np.linalg.norm(image.astype(np.float32) - guess, axis=2)
    near = image[distance < 14]
    if len(near) < 1000:
        return np.round(guess).astype(np.uint8)
    return np.round(np.median(near, axis=0)).astype(np.uint8)


def content_mask(image: np.ndarray, background: np.ndarray) -> np.ndarray:
    distance = np.linalg.norm(image.astype(np.float32) - background.astype(np.float32), axis=2)
    luminance = image.astype(np.float32).mean(axis=2)
    devices = distance > 45
    labels, count = ndimage.label(devices)
    if count:
        sizes = ndimage.sum(devices, labels, range(1, count + 1))
        keep_labels = {index + 1 for index, size in enumerate(sizes) if size > 20000}
        devices = np.isin(labels, list(keep_labels))
    devices = ndimage.binary_dilation(devices, iterations=2)
    titles = ndimage.binary_dilation((luminance > 105) & (np.arange(image.shape[0])[:, None] < 190), iterations=2)
    return devices | titles | (distance > 38)


def flatten(image: np.ndarray, background: np.ndarray) -> np.ndarray:
    output = image.copy()
    output[~content_mask(image, background)] = background
    return output


def fit_safe(source: Image.Image, canvas_size: tuple[int, int], safe: tuple[int, int, int, int], background: tuple[int, int, int]) -> Image.Image:
    canvas_w, canvas_h = canvas_size
    safe_x, safe_y, safe_w, safe_h = safe
    scale = min(safe_w / source.width, safe_h / source.height)
    resized = source.resize((max(1, round(source.width * scale)), max(1, round(source.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (canvas_w, canvas_h), background)
    x = safe_x + (safe_w - resized.width) // 2
    y = safe_y + (safe_h - resized.height) // 2
    canvas.paste(resized, (x, y))
    return canvas


def save_png(image: Image.Image, path: Path) -> None:
    image.convert("RGB").save(path, format="PNG", optimize=True)


def save_square(image: Image.Image, path: Path) -> None:
    image.convert("RGB").save(path, format="PNG", optimize=True)


def split_squares(flat: np.ndarray, background: np.ndarray) -> list[Image.Image]:
    distance = np.linalg.norm(flat.astype(np.float32) - background.astype(np.float32), axis=2)
    labels, count = ndimage.label(distance > 45)
    boxes = []
    if count:
        sizes = ndimage.sum(distance > 45, labels, range(1, count + 1))
        for index, size in enumerate(sizes):
            if size < 20000:
                continue
            ys, xs = np.where(labels == index + 1)
            boxes.append((int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())))
    boxes.sort(key=lambda box: box[0])
    if len(boxes) != 3:
        raise SystemExit(f"Expected 3 screens, found {len(boxes)}")

    squares = []
    for left, top, right, bottom in boxes:
        panel = flat[top : bottom + 1, left : right + 1]
        side = max(panel.shape[0], panel.shape[1]) + 72
        canvas = Image.new("RGB", (side, side), tuple(int(v) for v in background))
        tile = Image.fromarray(panel)
        canvas.paste(tile, ((side - tile.width) // 2, (side - tile.height) // 2))
        squares.append(canvas.resize((SQUARE, SQUARE), Image.Resampling.LANCZOS))
    return squares


def phone_square(image: np.ndarray, background: np.ndarray = BRAND_PURPLE) -> Image.Image:
    """Keep one phone, drop the headline above it, and center it on a flat square."""
    distance = np.linalg.norm(image.astype(np.float32) - background.astype(np.float32), axis=2)
    mask = distance > 28
    mask[:190] = False
    mask = ndimage.binary_closing(mask, iterations=6)
    mask = ndimage.binary_fill_holes(mask)
    labels, count = ndimage.label(mask)
    if count == 0:
        raise SystemExit("No phone found")
    sizes = ndimage.sum(mask, labels, range(1, count + 1))
    mask = labels == int(np.argmax(sizes)) + 1
    ys, xs = np.where(mask)
    top, bottom = int(ys.min()), int(ys.max())
    left, right = int(xs.min()), int(xs.max())
    mask = ndimage.binary_dilation(mask, iterations=2)
    panel_image = image[top : bottom + 1, left : right + 1]
    panel_mask = mask[top : bottom + 1, left : right + 1]
    panel = np.full_like(panel_image, background)
    panel[panel_mask] = panel_image[panel_mask]
    tile = Image.fromarray(panel)
    side = max(tile.width, tile.height) + 72
    color = tuple(int(v) for v in background)
    canvas = Image.new("RGB", (side, side), color)
    canvas.paste(tile, ((side - tile.width) // 2, (side - tile.height) // 2))
    return canvas.resize((SQUARE, SQUARE), Image.Resampling.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image", type=Path)
    parser.add_argument("--out", type=Path, default=Path("assets/store"))
    parser.add_argument("--split", action="store_true")
    args = parser.parse_args()

    source = np.array(Image.open(args.image).convert("RGB"))
    background = sample_background(source)
    flat = Image.fromarray(flatten(source, background))
    asc = args.out / "asc"
    screens = args.out / "screens"
    asc.mkdir(parents=True, exist_ok=True)
    color = tuple(int(v) for v in background)

    universal = fit_safe(flat, UNIVERSAL[:2], UNIVERSAL[2], color)
    header = fit_safe(flat, HEADER[:2], HEADER[2], color)
    save_png(universal, asc / "puffpuffstop-universal-5244x2950.png")
    save_png(header, asc / "puffpuffstop-header-3840x1646.png")
    if args.split:
        screens.mkdir(parents=True, exist_ok=True)
        names = ["01-breathe-easier.png", "02-track-progress.png", "03-reach-zero.png"]
        for name, square in zip(names, split_squares(np.array(flat), background)):
            save_square(square, screens / name)
    print(f"background RGB {color}")


if __name__ == "__main__":
    main()
