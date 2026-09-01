# Git identity — never use personal Gmail

Standing owner instruction (2026-08-19, restated):

- Never use the owner's personal Gmail, private GitHub noreply, or any other personal email for author, committer, push, or GitHub commit metadata.
- Always use `Cursor Agent <cursoragent@cursor.com>` via `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, and `GIT_COMMITTER_EMAIL`.
- Never change git config to set identity.
- If a push is rejected for email privacy, replay unpublished commits with the Cursor identity. Do not fall back to a personal address.

Also recorded in `/USER.md` and `/memory/MEMORY.md`.
