#!/usr/bin/env python3
"""Export Expo icon sizes from the brand master."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "assets/brand/source/app-icon-master.jpg"
MASTER = ROOT / "assets/brand/app-icon-1024.png"
IMAGES = ROOT / "assets/images"

SKY = (0, 184, 248)
SIZE = 1024
SAFE = 0.66


def fill_black(image: Image.Image, fill: tuple[int, int, int], threshold: int = 18) -> Image.Image:
    rgb = image.convert("RGB")
    pixels = rgb.load()
    width, height = rgb.size
    for y in range(height):
        for x in range(width):
            red, green, blue = pixels[x, y]
            if red <= threshold and green <= threshold and blue <= threshold:
                pixels[x, y] = fill
    return rgb


def trim_letterbox(image: Image.Image, threshold: int = 18) -> Image.Image:
    gray = ImageOps.grayscale(image)
    mask = gray.point(lambda value: 255 if value > threshold else 0)
    box = mask.getbbox()
    if not box:
        return image
    return image.crop(box)


def square_rgb(image: Image.Image, size: int, fill: tuple[int, int, int]) -> Image.Image:
    image = image.convert("RGB")
    fitted = ImageOps.contain(image, (size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), fill)
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2))
    return canvas


def adaptive_foreground(master: Image.Image, size: int) -> Image.Image:
    inner = int(size * SAFE)
    fitted = ImageOps.contain(master.convert("RGBA"), (inner, inner), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2), fitted)
    return canvas


def monochrome(foreground: Image.Image, size: int) -> Image.Image:
    gray = ImageOps.grayscale(foreground.convert("RGB"))
    alpha = foreground.getchannel("A") if "A" in foreground.getbands() else None
    out = ImageOps.autocontrast(gray).convert("RGBA")
    if alpha:
        out.putalpha(alpha.filter(ImageFilter.SMOOTH))
    return out.resize((size, size), Image.Resampling.LANCZOS)


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"missing source: {SOURCE}")

    trimmed = fill_black(trim_letterbox(Image.open(SOURCE)), SKY)
    master = square_rgb(trimmed, SIZE, SKY)
    save_png(master, MASTER)
    save_png(master, IMAGES / "icon.png")
    save_png(master.resize((48, 48), Image.Resampling.LANCZOS), IMAGES / "favicon.png")
    save_png(master.resize((256, 256), Image.Resampling.LANCZOS), IMAGES / "splash-icon.png")

    foreground = adaptive_foreground(master, SIZE)
    save_png(foreground, IMAGES / "android-icon-foreground.png")
    save_png(Image.new("RGB", (SIZE, SIZE), SKY), IMAGES / "android-icon-background.png")
    save_png(monochrome(foreground, 432), IMAGES / "android-icon-monochrome.png")

    checks = {
        MASTER: ("PNG", (1024, 1024), "RGB"),
        IMAGES / "icon.png": ("PNG", (1024, 1024), "RGB"),
        IMAGES / "favicon.png": ("PNG", (48, 48), "RGB"),
        IMAGES / "splash-icon.png": ("PNG", (256, 256), "RGB"),
        IMAGES / "android-icon-background.png": ("PNG", (1024, 1024), "RGB"),
        IMAGES / "android-icon-foreground.png": ("PNG", (1024, 1024), "RGBA"),
        IMAGES / "android-icon-monochrome.png": ("PNG", (432, 432), "RGBA"),
    }
    for path, (fmt, size, mode) in checks.items():
        probe = Image.open(path)
        if probe.format != fmt or probe.size != size or probe.mode != mode:
            raise SystemExit(f"{path.name}: got {probe.format} {probe.size} {probe.mode}")
    print("exported brand icons")


if __name__ == "__main__":
    main()
