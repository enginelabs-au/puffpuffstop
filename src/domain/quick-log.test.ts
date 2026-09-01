import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyVoiceLogToDaily,
  clampVoiceCount,
  GEMINI_LOG_HINT,
  VOICE_EXAMPLE_HINT,
  parseQuickLogUrl,
  SIRI_REDUCE_PHRASE,
  SIRI_RESET_PHRASE,
  SIRI_UNDO_ALL_PHRASE,
  VOICE_EXAMPLE_LOG,
  VOICE_EXAMPLE_REMOVE,
  voiceLogSpokenResult,
} from "./quick-log";

describe("voice log", () => {
  it("parses puffpuffstop quick-log URLs, counts, and clear-all", () => {
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=up&count=4"), {
      action: "up",
      count: 4,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=down&count=2"), {
      action: "down",
      count: 2,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=clear"), {
      action: "clear",
      count: 0,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=down&count=all"), {
      action: "clear",
      count: 0,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=undo&count=7"), {
      action: "down",
      count: 7,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=reduce&count=5"), {
      action: "down",
      count: 5,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=reset"), {
      action: "clear",
      count: 0,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=up&count=all"), {
      action: "up",
      count: 1,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=include&count=40"), {
      action: "up",
      count: 40,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=revert&count=3"), {
      action: "down",
      count: 3,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=reset&count=5"), {
      action: "down",
      count: 5,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=take-away&count=5"), {
      action: "down",
      count: 5,
    });
    assert.deepEqual(parseQuickLogUrl("puffpuffstop://quick-log?action=take-off&count=5"), {
      action: "down",
      count: 5,
    });
    assert.equal(parseQuickLogUrl("https://example.com"), null);
    assert.equal(clampVoiceCount(40), 40);
    assert.equal(clampVoiceCount("5 puffs"), 5);
    assert.equal(clampVoiceCount("five"), 5);
    assert.equal(clampVoiceCount("a puff"), 1);
    assert.equal(clampVoiceCount("1 puff"), 1);
    assert.equal(clampVoiceCount("forty"), 40);
    assert.equal(clampVoiceCount(2_000_000), 999_999);
  });

  it("increments, undoes a count, and clears the local day", () => {
    const today = "2026-09-01";
    const logged = applyVoiceLogToDaily(
      { dateKey: today, logged: 2, recoveryTicks: 4 },
      "up",
      today,
      3,
    );
    assert.deepEqual(logged, { dateKey: today, logged: 5, recoveryTicks: 4 });
    assert.deepEqual(applyVoiceLogToDaily(logged, "down", today, 2), {
      dateKey: today,
      logged: 3,
      recoveryTicks: 4,
    });
    assert.deepEqual(applyVoiceLogToDaily(logged, "clear", today), {
      dateKey: today,
      logged: 0,
      recoveryTicks: 4,
    });
  });

  it("speaks log, undo, and clear results", () => {
    assert.equal(
      voiceLogSpokenResult("up", "ok", 4, 3),
      "Logged 3 puffs. That's 4 puffs today.",
    );
    assert.equal(
      voiceLogSpokenResult("clear", "ok", 0, 5),
      "Cleared today's log. That's 0 puffs today.",
    );
    assert.match(SIRI_UNDO_ALL_PHRASE, /reset in PuffPuffStop/);
    assert.match(SIRI_RESET_PHRASE, /reset today's log/);
    assert.match(SIRI_REDUCE_PHRASE, /remove 5 puffs from/);
    assert.match(GEMINI_LOG_HINT, /log 5/);
    assert.match(GEMINI_LOG_HINT, /remove 5/);
    assert.match(GEMINI_LOG_HINT, /take 5 off/);
    assert.match(GEMINI_LOG_HINT, /reset in PuffPuffStop/);
    assert.match(VOICE_EXAMPLE_HINT, /from/);
    assert.match(VOICE_EXAMPLE_HINT, /PuffPuffStop/);
    assert.match(VOICE_EXAMPLE_HINT, /[Rr]emove/);
    assert.match(VOICE_EXAMPLE_HINT, /[Uu]ndo/);
    assert.match(VOICE_EXAMPLE_HINT, /[Rr]eset/);
    assert.match(VOICE_EXAMPLE_HINT, /take off/);
    assert.match(VOICE_EXAMPLE_HINT, /take away/);
    assert.match(VOICE_EXAMPLE_HINT, /decrease/);
    assert.equal(
      VOICE_EXAMPLE_LOG,
      "Hey (Assistant), Log a puff on PuffPuffStop",
    );
    assert.equal(
      VOICE_EXAMPLE_REMOVE,
      "Hey (Assistant), Remove 5 puffs from PuffPuffStop",
    );
  });
});
