# Flow and state matrix

| Flow | Screen | States | Phase | PRD |
|---|---|---|---|---|
| Launch | Age gate | default, pressed, a11y focus | 0 | PPS-AGE-01, PPS-P0-03 |
| Launch | Blocked | default (no loading, no error fetch) | 0 | PPS-AGE-02 |
| Launch | Foundation placeholder | default after allow | 0 only | PPS-P0-01 |
| Onboarding | Nickname | empty→friend, filled | 1 | PPS-ONB-02 |
| Onboarding | Duration | dial 0–999, period selected/unselected, invalid 0 if required | 1 | PPS-ONB-03 |
| Onboarding | Frequency | same | 1 | PPS-ONB-04 |
| Onboarding | Device type | 3 chips | 1 | PPS-ONB-05 |
| Onboarding | Brand | catalog chips, Other text, Custom | 1 | PPS-ONB-06 |
| Onboarding | Device math | catalog prefill editable / custom ml | 1 | PPS-ONB-07 |
| Onboarding | Nicotine | chips + Other | 1 | PPS-ONB-08 |
| Onboarding | Cost | skip or number | 1 | PPS-ONB-09 |
| Onboarding | Triggers | multi-select empty/partial/full | 1 | PPS-ONB-10 |
| Onboarding | Strictness | 3 exclusive | 1 | PPS-ONB-11 |
| Onboarding | Motivation | 4 exclusive | 1 | PPS-ONB-12 |
| Onboarding | Quit window | 5 exclusive | 1 | PPS-ONB-13 |
| Onboarding | Cut-down | dial + live commitment | 1 | PPS-ONB-14 |
| Plan | Plan | loading n/a (local), disclaimer visible | 1 | PPS-EST-05 |
| Home | Home | empty day, on-track, over-cap amber, undo snackbar, offline default | 2 | PPS-HOME-* |
| Settings | Settings groups | permission denied (notifications), confirm delete | 3 | PPS-SET-* |

Offline: all phase-0 screens work with no network. Permission: none in phase 0. Error: age-gate has no server error path.
