# Measurement plan (draft)

Baselines: unknown. Do not invent them.

## Later local events (not implemented in phase 0)

| Event | When | Properties (no extra PII) | Consent |
|---|---|---|---|
| `age_gate_allowed` | 16+ tap | none | after allow only |
| `age_gate_blocked` | under-16 tap | none; do not persist if that contradicts PPS-AGE-02 | **do not log** in v1 |
| `onboarding_completed` | required fields saved | quit_window, strictness | local |
| `puff_logged` | Log tap | on_track boolean | local |
| `day_recovered` | midnight under cap | none | local |

Blocked-path events stay off. That is a security/privacy constraint, not a growth optimization.

## Guardrails

- No remote analytics until Security re-review + consent copy
- No advertising IDs
- Success metrics in PRD remain targets-without-baselines
