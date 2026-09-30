# AGENTS.md — Canada.ca AI Components

## What This Is

A structured component knowledge base for AI coding agents building Government of Canada services with the Canada.ca Design System (GCWeb). 24 component tiles across 17 component families, with categorized adaptation metadata (schema v2), coordination metadata, pattern recipes, and compliance facts (Standard on Web Accessibility / WCAG 2.1 AA).

**Bilingual mandate:** every tile carries `discovery.languages: ["en", "fr"]`. Canada.ca services must exist in English AND French with equivalent content — the header language toggle is mandatory on every page. Agents generating Canada.ca UI must produce both language strings.

## How to Query This Registry

1. **Manifest:** https://raw.githubusercontent.com/ednark/canada-ai-components/main/agents.json
2. **Index:** https://raw.githubusercontent.com/ednark/canada-ai-components/main/infinite/components.index.json
3. **Facets:** https://raw.githubusercontent.com/ednark/canada-ai-components/main/infinite/facets.json
4. **Tile pattern:** https://raw.githubusercontent.com/ednark/canada-ai-components/main/infinite/{file}

## Workflow

1. Fetch the index (lean — discovery facets + lean summaries only)
2. Filter in code by section, canadaComponentType, requiresJs, a11y, govCompliance, costTier, compositionRecipes, languages
3. **Recipe check:** published patterns (contact-form, confirmation-page, search-results, content-page, validation-errors) — fetch `infinite/recipes/{name}.json` first
4. Fetch only the chosen tiles
5. Parse the `canada-agent-meta` JSON block inside each tile
6. Check `_schemaVersion` — v2 categories:
   - `discovery` — facets (index carries them; compliance/mobileUX/languages blocks are tile-side)
   - `selection` — `useWhen` / `avoidWhen`
   - `instruction` — `agentPrompt`
   - `coordination` — `compositionCost`, `agentPromptSequence`, `compositionRecipes` (controls embed their form-group wrappers — no external prerequisite)
   - `constraints` — `preserve` / `editable` / `limitations` / `portableInvariants`
   - `portability` — `classMapping` for uswds + govuk + dsfr substitution
7. Adapt within `constraints`; verify `constraints.preserve` in output

## Canada.ca-Specific Rules

- **Bilingual parity is law** (Official Languages Act): every page exists in EN and FR; the language toggle targets the equivalent page; produce both language strings for all generated UI
- **No global error summary** — errors are inline per field: `has-error` on the form-group + error text with `role='alert'` (unlike GOV.UK/USWDS)
- **Date modified indicator is mandatory** on every page (above the footer)
- **Dates are text inputs** — never add a calendar component (none exists in the design system)
- Use the Standard on Web Accessibility (WCAG 2.1 AA) — check `govCompliance`
- The Canada signature and wordmark are protected identity assets — never restyle

## Cross-Registry Transfer

- `portability.classMapping` covers uswds + govuk + dsfr for simple cases (button, text-input, select, alert, table, breadcrumb, checkbox, radio)
- `compatibility.json` holds family-level maps for all three targets with mismatch notes
- Validate output against `constraints.portableInvariants`

## MCP Server

`node _base/mcp/server.mjs` (or `npm run mcp`) — 9 tools: `search_components`, `get_component`, `list_facets`, `get_index`, `get_adapter`, `translate_component`, `get_recipe`, `query_compliance`, `get_versions`

CLI: `node _base/validate-registry.mjs` (lint), `--conformance .` (certification)


## Quality gates and declared gaps

Do not retrieve or deploy a component that:

- Has `costTier: "expensive"` unless the task explicitly requires the richer behavior
- Has `requiresJs: "required"` when the delivery context has no JavaScript
- Whose `constraints.knownLimitations` block the delivery context
- Implements a concept declared in `gaps` (registry.config.json) — use the gap's nearestAlternative; never invent component-style classes
- Needs layout or typography classes outside the tiles — use `infinite/core-classes.json`

Registry mandates that act as gates:

- Bilingual EN/FR parity is law (Official Languages Act) — produce both language strings; the language toggle must target an equivalent page
- Inline per-field errors only (role='alert') — there is no page-level error summary
- Every page carries the Date modified indicator (mandatory)
- Check `govCompliance` (Standard on Web Accessibility / WCAG 2.1 AA)

## Constraint Priority

1. `constraints.preserve` — NEVER modify
2. `constraints.limitations` — respect
3. `instruction.agentPrompt` — adapt within boundaries
4. `constraints.editable` — prefer

## Version Sync

This registry mirrors **WET-BOEW v19.6.0** (2026-08-18) — the toolkit
canada.ca actually serves. The version is declared in the served stylesheet's
own header, which is vendored verbatim at
`infinite/ground-truth/wet-boew-19.6.0.css` and declared to `staticView.css`
and `staticView.classCheck`.

WET-BOEW ships no npm package, so `groundTruth` is `live-site`: this is a
**snapshot mechanism, not a CI-installable one**. When the site moves, refresh
the vendored stylesheet and re-run the check.

The class check spans 35 namespaces because the tiles mix WET (`wb-*`),
Bootstrap (`btn-*`, `form-*`, `col-*`), and canada.ca-specific (`gc-*`) classes.
The allowlist holds two documented site-layer entries (`wb-eqht`, a dead class
the site still uses; `gc-search`, a canada.ca-specific component).

canada.ca also loads GC Design System web components from an alpha CDN; GCDS
styles live in shadow DOM and are **not** a verification target for these tiles.
