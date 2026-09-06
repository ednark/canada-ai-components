/**
 * GOV.UK AI Components — tile builder.
 *
 * Renders self-contained tiles from tools/inventory.mjs: one HTML file per
 * variant with real GOV.UK markup, inline CSS approximation, and the full
 * v2 agent-meta block (discovery/selection/instruction/coordination/
 * constraints/portability + compliance/mobileUX).
 *
 * Usage: node tools/build-registry.mjs [--force]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { inventory, COMPLIANCE } from './inventory.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TILE_DIR = join(ROOT, 'infinite');
const FORCE = process.argv.includes('--force');

// ─── Shared CSS (GOV.UK visual language approximation) ───────────────────────

const BASE_CSS = `
body{font-family:'Noto Sans',Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#333;padding:2rem;background:#fff;margin:0}
.cap{position:fixed;bottom:12px;left:16px;font-size:11px;letter-spacing:.08em;color:#6f6f6f;text-transform:uppercase}
a{color:#284162}
h2{font-size:1.375rem;margin:0 0 .5rem}
:focus-visible{outline:2px solid #0535d2;outline-offset:2px}
.wb-inv{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
legend.h5,.h5{font-weight:700;font-size:1rem;margin:0 0 .5rem}
`;

const CSS = {
  'button': `.btn{font:inherit;display:inline-block;padding:.5rem 1rem;border-radius:4px;border:1px solid transparent;background:#284162;color:#fff;cursor:pointer;text-decoration:none}
.btn:hover{background:#1c2d49}
.btn-default{background:#eaebed;color:#335075;border:1px solid #dcdee1}
.btn-default:hover{background:#dcdee1}
.btn-link{background:none;border:0;color:#284162;text-decoration:underline;padding:0}
.btn[disabled]{opacity:.65;cursor:not-allowed}
`,
  'text-input': `.form-group{margin-bottom:1.25rem;max-width:30rem}
.form-control{font:inherit;display:block;width:100%;box-sizing:border-box;padding:.5rem .6rem;border:1px solid #6f6f6f;border-radius:4px;color:#333;background:#fff;height:2.4rem}
.form-control:focus{outline:2px solid #0535d2;outline-offset:2px}
label.required:after{content:"*";color:#a91e1e;margin-left:.25rem}
.has-error .form-control{border-color:#a91e1e;border-width:2px}
.error,.error-message{color:#a91e1e;font-weight:700}
`,
  'textarea': `.form-group{margin-bottom:1.25rem;max-width:30rem}
.form-control{font:inherit;display:block;width:100%;box-sizing:border-box;padding:.5rem .6rem;border:1px solid #6f6f6f;border-radius:4px;color:#333;background:#fff}
.form-control:focus{outline:2px solid #0535d2}
textarea.form-control{min-height:8rem}
`,
  'select': `.form-group{margin-bottom:1.25rem;max-width:30rem}
.form-control{font:inherit;display:block;width:100%;padding:.5rem .6rem;border:1px solid #6f6f6f;border-radius:4px;background:#fff;color:#333}
.form-control:focus{outline:2px solid #0535d2}
`,
  'checkbox': `.checkbox,.radio{margin-bottom:.75rem;max-width:30rem}
.gc-chckbxrdio input[type=checkbox]{position:absolute;opacity:0;width:24px;height:24px;margin:0}
.gc-chckbxrdio label{cursor:pointer;display:inline-block;padding-left:2.2rem}
.gc-chckbxrdio label:before{content:"";position:absolute;left:0;top:2px;width:19px;height:19px;border:2px solid #284162;border-radius:.15rem;background:#fff}
.gc-chckbxrdio input[type=checkbox]:checked+label:after{content:"✓";position:absolute;left:4px;top:-1px;color:#284162;font-weight:700}
.gc-chckbxrdio input[type=checkbox]:focus+label:before{outline:2px solid #0535d2;outline-offset:2px}
`,
  'radio': `.legend-brdr-bttm{border:0;padding:0;margin:0 0 1rem;border-bottom:1px solid #ccc}
.radio{margin-bottom:.5rem}
.radio label{display:inline-block;padding-left:1.5rem;position:relative;cursor:pointer}
.radio input[type=radio]{position:absolute;opacity:0;left:0;top:4px;width:18px;height:18px;margin:0}
.radio label:before{content:"";position:absolute;left:0;top:2px;width:17px;height:17px;border:2px solid #284162;border-radius:50%;background:#fff}
.radio input[type=radio]:checked+label:after{content:"";position:absolute;left:5px;top:7px;width:9px;height:9px;border-radius:50%;background:#284162}
.radio input[type=radio]:focus+label:before{outline:2px solid #0535d2;outline-offset:2px}
`,
  'search': `.form-inline{display:flex;gap:.5rem;max-width:30rem}
.form-inline label{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.form-inline .form-control{flex:1;border-radius:4px 0 0 4px}
.form-inline .btn{border-radius:0 4px 4px 0}
`,
  'breadcrumb': `.breadcrumb{list-style:none;margin:1rem 0;padding:.5rem 0;display:flex;flex-wrap:wrap;gap:.35rem;font-size:.875rem;border-bottom:1px solid #eaebed}
.breadcrumb li:not(:first-child):before{content:"›";margin-right:.35rem;color:#6f6f6f}
.breadcrumb li[aria-current=page]{color:#333}
`,
  'back-link': `.btn-link:before{content:"‹";margin-right:.35rem;font-size:1.1em}
`,
  'pagination': `.pagination{list-style:none;margin:1rem 0;padding:0;display:flex;gap:.25rem}
.pagination li a{display:inline-block;padding:.35rem .65rem;color:#284162;text-decoration:underline;border:1px solid transparent;border-radius:4px}
.pagination .active a{background:#284162;color:#fff;text-decoration:none;font-weight:700}
`,
  'header': `.canada-header{border-bottom:0;margin:-2rem -2rem 2rem;background:#fff;border-bottom:1px solid #eaebed}
header{padding:0}
#wb-lng{list-style:none;margin:0;padding:.5rem 1rem;display:flex;justify-content:flex-end;gap:1rem}
#wb-lng a{color:#284162}
.brand{padding:.5rem 1rem;display:block}
.gc-search{padding:.5rem 1rem 1rem}
.gc-search form{display:flex;gap:.5rem;max-width:30rem}
.gc-search .form-control{border-radius:4px 0 0 4px}
.gc-search .btn{border-radius:0 4px 4px 0}
`,
  'language-toggle': `.list-inline{list-style:none;margin:0;padding:.5rem 1rem;display:flex;justify-content:flex-end;gap:1rem}
.list-inline a{color:#284162}
`,
  'footer': `.footer{background:#f8f8f8;border-top:1px solid #eaebed;margin:3rem -2rem -2rem;padding:1.5rem}
.footer .brand{padding:.5rem 0;display:block}
.flag:after{content:"Canada";font-weight:700;color:#161616;font-size:1.1rem}
.footer nav ul{list-style:none;margin:0 0 1rem;padding:0;display:flex;flex-wrap:wrap;gap:1rem}
.footer nav a{color:#284162}
`,
  'date-modified': `.datemod{border-top:1px solid #eaebed;padding-top:.75rem;margin-top:2rem}
.datemod h2{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.datemod p{margin:0;font-size:.875rem}
`,
  'alert': `.alert{padding:1rem 1.5rem;margin-bottom:1.25rem;border-radius:4px;border:1px solid}
.alert-info{background:#d7f0f7;border-color:#269abc;color:#12525c}
.alert-success{background:#d8eeca;border-color:#278400;color:#278400}
.alert-danger{background:#f3e9e8;border-color:#a91e1e;color:#a91e1e}
.alert-warning{background:#fcf0d5;border-color:#ee7100;color:#5c3b00}
.alert h2{font-size:1.125rem;margin:0 0 .25rem}
.alert p{margin:0}
`,
  'details': `.details summary,summary{cursor:pointer;color:#284162;font-weight:500;padding:.35rem 0}
details{border:1px solid #eaebed;border-radius:4px;padding:.75rem 1rem;margin:1rem 0;max-width:40rem}
details[open]{padding-bottom:1.25rem}
summary:before{content:"+";margin-right:.5rem;font-weight:700}
details[open] summary:before{content:"−"}
`,
  'table': `.table-responsive{overflow-x:auto;max-width:40rem}
.table{width:100%;border-collapse:collapse;margin:1rem 0}
.table caption{font-weight:700;text-align:left;margin-bottom:.5rem}
.table th{text-align:left;font-weight:700;padding:.5rem .75rem;border-bottom:2px solid #284162}
.table td{padding:.5rem .75rem;border-bottom:1px solid #ccc}
.table-striped tbody tr:nth-child(even){background:#f8f8f8}
`
,
'footnotes': `.wb-fnotes{border-top:1px solid #ccc;padding-top:1rem;margin-top:2rem;max-width:40rem}
.wb-fnotes h2{font-size:1.125rem;margin:0 0 .5rem}
.footnotes{list-style:decimal;margin:0;padding-left:1.5rem}
.footnotes p{margin:.25rem 0;font-size:.875rem}
.fn-lnk a,.fn-lnk{color:#284162;text-decoration:underline;font-size:.75rem;vertical-align:super}
.fn-rtn{color:#284162;font-size:.75rem;text-decoration:underline}
.example-body{max-width:40rem}
`
};


// ─── Cost model (same calibration as the USWDS registry) ────────────────────

function costDefaults(bytes, requiresJs) {
  const estimatedTokens = Math.ceil(bytes / 4);
  let costTier;
  if (requiresJs === 'required') costTier = estimatedTokens > 2000 ? 'expensive' : 'moderate';
  else if (requiresJs === 'optional') costTier = 'moderate';
  else costTier = estimatedTokens > 1000 ? 'moderate' : 'cheap';
  const renderingTimeMs = requiresJs === 'required' ? 60 : requiresJs === 'optional' ? 35 : 15;
  const recommendedModel = costTier === 'expensive' ? 'sonnet' : 'haiku';
  return { costTier, estimatedTokens, renderingTimeMs, recommendedModel };
}

// ─── Recipe membership ───────────────────────────────────────────────────────

const recipeMembership = {};
try {
  const recipesDir = join(TILE_DIR, 'recipes');
  for (const item of readdirSync(recipesDir)) {
    if (!item.endsWith('.json') || item === 'index.json') continue;
    const recipe = JSON.parse(readFileSync(join(recipesDir, item), 'utf-8'));
    for (const c of recipe.components || []) {
      (recipeMembership[c.component] ||= []).push(recipe.recipe);
    }
  }
} catch {
  console.log('(no recipes yet — compositionRecipes skipped)');
}

// ─── Meta assembly ───────────────────────────────────────────────────────────

function buildMeta(component, variant, relPath, html) {
  const bytes = Buffer.byteLength(html, 'utf-8');
  const cost = costDefaults(bytes, component.requiresJs);
  const requiresJs = component.requiresJs;
  const isInteractive = (component.interaction || []).length > 0;

  const coord = {
    prerequisiteComponents: component.prerequisites || [],
    incompatibleWith: component.incompatibleWith || [],
    compositionCost: cost,
  };
  if (component.agentPromptSequence) coord.agentPromptSequence = component.agentPromptSequence;
  const memberOf = [...new Set(recipeMembership[component.dir] || [])];
  if (memberOf.length) coord.compositionRecipes = memberOf;

  const meta = {
    _schemaVersion: 2,
    discovery: {
      canadaComponentType: component.dir,
      canadaClass: component.cls,
      section: component.section,
      variant: variant,
      requiresJs,
      interaction: component.interaction || [],
      a11y: {
        wcag21AA: true,
        keyboardNav: isInteractive,
        screenReader: true,
        reducedMotion: true,
        forcedColors: true,
        ariaAttributes: true,
      },
      govCompliance: COMPLIANCE,
      tier: 'curated',
      tags: component.tags,
      description: component.description,
      compliance: {
        nistControls: [],
        standardWebAccessibility: true,
        wcag21AA: true,
        webAccessibilityDirective: true,
        piiHandling: component.pii || 'none',
        auditTrailCompatible: component.audit || false,
        dataMaskingCompatible: component.dir === 'text-input',
      },
      languages: ["en", "fr"],
      mobileUX: {
        touchTargetSize: isInteractive ? '44px' : 'n/a',
        requiredMinSpacing: '8px',
        orientationLocked: false,
        fullscreenSafe: true,
      },
    },
    selection: {
      useWhen: component.useWhen,
      avoidWhen: component.avoidWhen,
    },
    instruction: {
      agentPrompt: component.agentPrompt,
      relatedComponents: component.related || [],
    },
    coordination: coord,
    constraints: {
      preserve: component.preserve,
      editable: component.editable,
      limitations: component.limitations,
      portableInvariants: component.invariants,
    },
    supportedTokenProfiles: ['highContrast'],
    ...(component.provenance && { provenance: component.provenance }),
    file: relPath,
    title: `${component.name} (${variant})`,
  };

  if (component.classMappingUswds) {
    meta.portability = {
      classMapping: { uswds: component.classMappingUswds },
    };
  }
  return meta;
}

// ─── Tile rendering ──────────────────────────────────────────────────────────

function renderTile(component, variant, relPath, markup) {
  const meta = buildMeta(component, variant.variant, relPath, markup);
  const description = `Canada.ca Design System ${component.name.toLowerCase()} demonstrating the ${variant.variant} variant.`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${component.name} (${variant.variant})</title>
<script type="application/json" id="canada-agent-meta">
${JSON.stringify(meta, null, 2)}
</script>
<style>${BASE_CSS}
${CSS[component.dir] || ''}
</style>
</head>
<body>
${markup}
<div class="cap">${component.dir} ${variant.variant}</div>
</body>
</html>
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

let written = 0;
for (const component of inventory) {
  const variants = component.variants || [
    { file: 'default', variant: 'default', desc: component.description, markup: component.defaultMarkup },
  ];
  const dir = join(TILE_DIR, component.dir);
  mkdirSync(dir, { recursive: true });
  for (const variant of variants) {
    const markup = variant.markup ?? component.defaultMarkup;
    if (!markup) {
      console.error(`  ✗ ${component.dir}/${variant.file}: no markup`);
      continue;
    }
    const relPath = `${component.dir}/${variant.file}.html`;
    const outPath = join(TILE_DIR, relPath);
    if (!FORCE && existsSync(outPath)) continue; // hand-edited tiles survive re-runs
    writeFileSync(outPath, renderTile(component, variant, relPath, markup));
    written++;
    console.log(`  ✓ ${relPath}`);
  }
}
console.log(`\nWrote ${written} tiles (${inventory.length} components)`);
