import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_TITLE } from "./privacy-policy";

export function privacyPolicyHtml(): string {
  const sections = PRIVACY_POLICY_SECTIONS.map(
    (section) =>
      `<h2>${escapeHtml(section.heading)}</h2>\n<p>${escapeHtml(section.body)}</p>`,
  ).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PuffPuffStop ${PRIVACY_POLICY_TITLE}</title>
</head>
<body>
  <h1>PuffPuffStop ${PRIVACY_POLICY_TITLE}</h1>
  ${sections}
</body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
