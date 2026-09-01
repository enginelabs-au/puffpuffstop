---
plan: phase_11_quick-log-hardware
status: verified
created: 2026-09-01
updated: 2026-09-01
owner: lead-agent
source_phase: docs/plans/phase_10_friendly-science-onboarding_plan.md
workstream: docs/workstreams/20260901-quick-log-hardware/manifest.md
---

# Phase 11: Voice log from Siri and Gemini

## 1. Objective

Let the owner log or undo a puff with the phone locked by talking to the native assistant: Siri on iPhone, Gemini or Google Assistant on Android. Volume-button quick log is removed on both OS — it only worked while the app was open.

## 2. Non-goals

Store submit, Accessibility Services, jailbreak remaps, remote push, ads, guaranteed Gemini App Functions indexing (Google’s first-class Gemini SDK is still preview/EAP).

## 3. Acceptance

- No volume-button, tile, or confirm-notification quick log.
- iOS App Intents write `puffpuffstop-snapshot.json` with `openAppWhenRun = false` and speak a result.
- Android exports a headless Log puff / Undo puff activity plus launcher shortcuts Gemini or Assistant can run, or that the owner can bind once in a Routine.
- Onboarding and Settings explain the phrases without overclaiming Gemini.
- Tests, lint, and typecheck pass.

## 4. Platform notes

- **Siri:** first-class. “Hey Siri, log a puff in PuffPuffStop.” Works after the app has created a snapshot once.
- **Gemini:** no public locked-phone equivalent of App Intents. Practical path is a donated shortcut / custom intent. If Gemini does not discover it, the owner adds a one-time Routine.
- Voice-only midnight rollover may delay recovery ticks until the app is opened.

## 5. Validation

- `npm run lint`, `npm test`, `npm run typecheck` after the pivot.
