# Canada.ca AI Components

AI-retrievable component registry for the [Canada.ca Design System](https://design.canada.ca) — 24 self-contained component tiles across 17 component families, for AI coding agents building Government of Canada services.

Implements the [ai-component-registry-spec](https://github.com/ednark/ai-component-registry-spec) protocol (submodule at `_base/`). Sibling to [uswds-ai-components](https://github.com/ednark/uswds-ai-components), [govuk-ai-components](https://github.com/ednark/govuk-ai-components), [dsfr-ai-components](https://github.com/ednark/dsfr-ai-components), and [ecl-ai-components](https://github.com/ednark/ecl-ai-components).

## Quick start (agents)

1. [agents.json](https://raw.githubusercontent.com/ednark/canada-ai-components/main/agents.json) — manifest
2. [components.index.json](https://raw.githubusercontent.com/ednark/canada-ai-components/main/infinite/components.index.json) — lean discovery index, filter in code
3. `infinite/{file}` — tile: source + embedded `canada-agent-meta`
4. [recipes](https://raw.githubusercontent.com/ednark/canada-ai-components/main/infinite/recipes/index.json) — patterns as atomic fetches

MCP: `npm run mcp` (9 tools). Validate: `node _base/validate-registry.mjs`.

## Coverage

**Forms:** button, text-input, textarea, select, checkbox (gc-chckbxrdio), radio, search
**Navigation:** breadcrumb, back-link, pagination, header (signature + language toggle), footer, date-modified
**Feedback:** alert (info/success/danger/warning), details
**Data display:** table (default/striped)

Recipes: contact-form, confirmation-page, search-results, content-page, validation-errors.

## Compliance metadata

All tiles carry `govCompliance: ["Standard on Web Accessibility", "WCAG 2.1 AA"]` plus per-tile `compliance` facts (PII handling, audit-trail) and `mobileUX` facts. Canada-specific: the `languages: ["en","fr"]` facet on every tile encodes the Official Languages Act bilingual parity mandate; FedRAMP fields intentionally omitted.

## Notes

- Tiles are original inline-CSS approximations, not copies of GCWeb source
- The Canada signature and wordmark are protected identity assets — see header/footer tiles
- Inline-error model documented (no global error summary exists in the design system)
