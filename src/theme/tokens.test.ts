import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { color, minTapTarget, motion, radius, space, tokens, type } from "./tokens";

describe("design tokens", () => {
  it("exports the required color keys", () => {
    for (const key of [
      "sky",
      "bg",
      "surface",
      "ink",
      "inkMuted",
      "accent",
      "accentMint",
      "amber",
      "danger",
      "blockedBg",
    ] as const) {
      assert.equal(typeof color[key], "string");
      assert.match(color[key], /^#/);
    }
  });

  it("uses the specified spacing and radius scale", () => {
    assert.deepEqual(space, { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 });
    assert.deepEqual(radius, { sm: 12, md: 20, pill: 999 });
    assert.equal(minTapTarget, 44);
    assert.equal(motion.fast, 160);
    assert.equal(type.title.fontSize, 28);
    assert.equal(tokens.color.bg, color.bg);
    assert.equal(color.sky, "#00B8F8");
    assert.equal(color.bg, "#D8F4FC");
  });
});
