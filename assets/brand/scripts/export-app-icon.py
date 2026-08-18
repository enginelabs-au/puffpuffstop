#!/usr/bin/env python3
"""Export Expo icon sizes from the brand master."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/brand/source/app-icon-master.jpg"
MASTER = ROOT / "assets/brand/app-icon-1024.png"
IMAGES = ROOT / "assets/images"

SIZE = 1024
SAFE = 0.72


def trim_letterbox(image: Image.Image, threshold: int = 18) -> Image.Image:
    gray = ImageOps.grayscale(image)
    mask = gray.point(lambda value: 255 if value > threshold else 0)
    box = mask.getbbox()
    if not box:
        return image
    return image.crop(box)


def knockout_outside(image: Image.Image, threshold: int = 22) -> Image.Image:
    """Make corner/letterbox pixels transparent without touching inner sky."""
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    seen = bytearray(width * height)
    stack = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]

    def is_outside(red: int, green: int, blue: int, alpha: int) -> bool:
        if alpha == 0:
            return True
        return red <= threshold and green <= threshold and blue <= threshold

    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= width or y >= height:
            continue
        index = y * width + x
        if seen[index]:
            continue
        seen[index] = 1
        red, green, blue, alpha = pixels[x, y]
        if not is_outside(red, green, blue, alpha):
            continue
        pixels[x, y] = (0, 0, 0, 0)
        stack.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))

    alpha = rgba.getchannel("A").filter(ImageFilter.MinFilter(3))
    rgba.putalpha(alpha)
    return rgba


def square_rgba(image: Image.Image, size: int) -> Image.Image:
    fitted = ImageOps.contain(image.convert("RGBA"), (size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2), fitted)
    return canvas


def adaptive_foreground(master: Image.Image, size: int) -> Image.Image:
    inner = int(size * SAFE)
    fitted = ImageOps.contain(master.convert("RGBA"), (inner, inner), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2), fitted)
    return canvas


def monochrome(foreground: Image.Image, size: int) -> Image.Image:
    gray = ImageOps.grayscale(foreground.convert("RGB"))
    alpha = foreground.getchannel("A")
    out = ImageOps.autocontrast(gray).convert("RGBA")
    out.putalpha(alpha.filter(ImageFilter.SMOOTH))
    return out.resize((size, size), Image.Resampling.LANCZOS)


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"missing source: {SOURCE}")

    cutout = knockout_outside(trim_letterbox(Image.open(SOURCE)))
    master = square_rgba(cutout, SIZE)
    save_png(master, MASTER)
    save_png(master, IMAGES / "icon.png")
    save_png(master.resize((48, 48), Image.Resampling.LANCZOS), IMAGES / "favicon.png")
    save_png(master.resize((256, 256), Image.Resampling.LANCZOS), IMAGES / "splash-icon.png")

    foreground = adaptive_foreground(master, SIZE)
    save_png(foreground, IMAGES / "android-icon-foreground.png")
    save_png(Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0)), IMAGES / "android-icon-background.png")
    save_png(monochrome(foreground, 432), IMAGES / "android-icon-monochrome.png")

    checks = {
        MASTER: ((1024, 1024), "RGBA"),
        IMAGES / "icon.png": ((1024, 1024), "RGBA"),
        IMAGES / "favicon.png": ((48, 48), "RGBA"),
        IMAGES / "splash-icon.png": ((256, 256), "RGBA"),
        IMAGES / "android-icon-background.png": ((1024, 1024), "RGBA"),
        IMAGES / "android-icon-foreground.png": ((1024, 1024), "RGBA"),
        IMAGES / "android-icon-monochrome.png": ((432, 432), "RGBA"),
    }
    for path, (size, mode) in checks.items():
        probe = Image.open(path)
        if probe.format != "PNG" or probe.size != size or probe.mode != mode:
            raise SystemExit(f"{path.name}: got {probe.format} {probe.size} {probe.mode}")
        if probe.getpixel((0, 0))[3] != 0:
            raise SystemExit(f"{path.name}: corner is not transparent")
    print("exported brand icons")


if __name__ == "__main__":
    main()
