/**
 * Canada.ca AI Components — component inventory.
 *
 * Each component declares its variants (real Canada.ca/GCWeb markup), metadata
 * for the v2 categorized schema, coordination, and compliance facts. The
 * builder (build-registry.mjs) turns this into self-contained tiles.
 *
 * Bilingual mandate: every tile carries discovery.languages ["en","fr"].
 * Markup labels are in English; agents generating Canada.ca content must
 * produce EN + FR parity (see AGENTS.md). Class names: GCWeb/Bootstrap-style
 * (btn, form-control, alert-*, gc-chckbxrdio).
 */

export const COMPLIANCE = ["Standard on Web Accessibility", "WCAG 2.1 AA"];

export const LANGUAGES = ["en", "fr"];

export const inventory = [
  // ─── FORMS ────────────────────────────────────────────────────────────────
  {
    dir: "button",
    name: "Button",
    cls: "btn",
    section: "forms",
    requiresJs: "no",
    interaction: ["click", "focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: [
      "Primary actions — btn btn-primary (dark blue)",
      "Secondary/neutral actions — btn btn-default; text-like — btn btn-link"
    ],
    avoidWhen: ["Links between pages — use plain links", "Multiple primary buttons per view"],
    agentPrompt: "Edit the label. Primary: btn btn-primary; secondary: btn btn-default; link-styled: btn btn-link. Disabled: add disabled attribute.",
    preserve: [
      ".btn base class on a <button> element for form submission",
      "type='submit' inside forms",
      "disabled attribute for disabled state"
    ],
    editable: ["Label text", "Variant class"],
    limitations: ["One primary button per view", "Never use btn-link for destructive actions"],
    invariants: ["Semantic <button> or <a> root element", "Accessible name preserved"],
    related: ["text-input", "alert"],
    tags: ["button", "submit", "action", "cta"],
    description: "Primary, default, and link-styled buttons (btn).",
    variants: [
      {
        file: "primary", variant: "primary",
        desc: "Primary button (dark blue).",
        markup: `<button class="btn btn-primary" type="submit">Submit</button>`
      },
      {
        file: "default", variant: "default",
        desc: "Default (neutral) button.",
        markup: `<button class="btn btn-default" type="button">Secondary action</button>`
      },
      {
        file: "link", variant: "link",
        desc: "Link-styled button.",
        markup: `<button class="btn btn-link" type="button">Cancel</button>`
      },
      {
        file: "disabled", variant: "disabled",
        desc: "Disabled button.",
        markup: `<button class="btn btn-primary" type="button" disabled>Submit application</button>`
      }
    ]
  },
  {
    dir: "text-input",
    name: "Text input",
    cls: "form-control",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Short free-text answers (name, email, file number)"],
    avoidWhen: ["Longer answers — use textarea", "Dates — Canada.ca uses separate day/month/year text inputs without a calendar"],
    agentPrompt: "Edit the label. Required fields carry a '(required)' suffix in the label. Error state: has-error on the form-group plus an error text span with role='alert'; Canada.ca has no global error summary — keep errors inline.",
    preserve: [
      ".form-control class on the input",
      ".form-group wrapper with label",
      "Label 'for' association",
      "required marker in the label text"
    ],
    editable: ["Label text", "type attribute (text, email, tel)", "Input width styling"],
    limitations: ["No calendar component exists in the design system — never add one for date entry", "Inline errors only — no page-level error summary pattern"],
    invariants: ["Semantic <input> element", "Label association via for/id"],
    related: ["button", "alert"],
    tags: ["input", "text", "form", "field"],
    description: "Text input with form group, required marker, and inline errors (form-control).",
    defaultMarkup: `<div class="form-group">
  <label for="ti-example" class="required">Email address <strong class="required">(required)</strong></label>
  <input type="text" id="ti-example" name="email" class="form-control" autocomplete="email">
</div>`,
  },
  {
    dir: "textarea",
    name: "Textarea",
    cls: "form-control",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Longer free-text answers (description, message)"],
    avoidWhen: ["Single-line values — use text-input"],
    agentPrompt: "Adjust the rows attribute. Error state: has-error on the form-group plus error text span with role='alert'.",
    preserve: [".form-control class on the textarea", ".form-group wrapper", "Label 'for' association"],
    editable: ["Label text", "rows attribute"],
    limitations: ["Fixed height by rows"],
    invariants: ["Semantic <textarea> element", "Label association via for/id"],
    related: ["text-input", "button"],
    tags: ["textarea", "multiline", "form"],
    description: "Multi-line text input (form-control).",
    defaultMarkup: `<div class="form-group">
  <label for="ta-example">Your message</label>
  <textarea id="ta-example" name="message" rows="5" class="form-control"></textarea>
</div>`,
  },
  {
    dir: "select",
    name: "Select",
    cls: "form-control",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "change"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Choosing one option from a short list"],
    avoidWhen: ["Long option lists", "Yes/no — use radio"],
    agentPrompt: "Replace <option> values and text. Error state: has-error on the form-group plus error text span with role='alert'.",
    preserve: [".form-control class on the <select>", ".form-group wrapper with label"],
    editable: ["Label text", "Option list"],
    limitations: ["Native select — platform appearance varies"],
    invariants: ["Semantic <select> with <option> children"],
    related: ["radio", "button"],
    tags: ["select", "dropdown", "form"],
    description: "Dropdown select with form group (form-control).",
    defaultMarkup: `<div class="form-group">
  <label for="sel-example">Province or territory</label>
  <select id="sel-example" name="province" class="form-control">
    <option value="">Select an option</option>
    <option value="on">Ontario</option>
    <option value="qc">Quebec</option>
    <option value="bc">British Columbia</option>
  </select>
</div>`,
  },
  {
    dir: "checkbox",
    name: "Checkbox",
    cls: "gc-chckbxrdio",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Multiple selections including none", "Single consent checkbox"],
    avoidWhen: ["Exactly one choice — use radio"],
    agentPrompt: "Edit option labels. The gc-chckbxrdio wrapper renders the custom check — keep input before label inside it. Errors: has-error on the group + error text with role='alert'.",
    preserve: [
      ".gc-chckbxrdio wrapper per option",
      "input-before-label ordering inside the wrapper",
      "Label 'for' association"
    ],
    editable: ["Option labels", "Values"],
    limitations: ["Do not pre-check consent boxes"],
    invariants: ["Real <input type='checkbox'> elements"],
    related: ["radio", "button"],
    tags: ["checkbox", "multiple", "form", "options"],
    description: "Checkbox with GCWeb custom check renderer (gc-chckbxrdio).",
    defaultMarkup: `<div class="checkbox gc-chckbxrdio">
  <input type="checkbox" id="cb-example" name="consent">
  <label for="cb-example">I agree to the data protection terms</label>
</div>`,
  },
  {
    dir: "radio",
    name: "Radio",
    cls: "radio",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Exactly one choice from a small set", "Yes/no questions"],
    avoidWhen: ["Multiple selections — use checkbox"],
    agentPrompt: "Edit option labels. All radios share one name attribute. Errors: has-error on the group + error text span with role='alert'.",
    preserve: [
      ".radio wrapper per option with label wrapping the input",
      "Same name attribute on all radios"
    ],
    editable: ["Option labels", "Values"],
    limitations: ["Keep option lists short"],
    invariants: ["Real <input type='radio'> elements sharing one name"],
    related: ["checkbox", "button"],
    tags: ["radio", "single-choice", "form"],
    description: "Radio group for single-choice questions.",
    defaultMarkup: `<fieldset class="legend-brdr-bttm">
  <legend class="h5">Preferred contact method</legend>
  <div class="radio">
    <label for="rd-email"><input type="radio" id="rd-email" name="contact" value="email"> Email</label>
  </div>
  <div class="radio">
    <label for="rd-phone"><input type="radio" id="rd-phone" name="contact" value="phone"> Phone</label>
  </div>
</fieldset>`,
  },
  {
    dir: "search",
    name: "Search box",
    cls: "gcsearchbox",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus", "click"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Site search in the header band or on landing pages"],
    avoidWhen: ["Filtering within one page"],
    agentPrompt: "Set the form action. The visually-hidden label is mandatory. The search button carries the search icon and accessible title.",
    preserve: [
      "form with role='search' behaviour",
      "Visually-hidden label on the input",
      "Search submit button with accessible title"
    ],
    editable: ["Placeholder text", "Action", "Button title"],
    limitations: ["Keep the hidden label — the input has no visible text label"],
    invariants: ["Input associated with a label", "Submit button inside the form"],
    related: ["table", "pagination", "header"],
    tags: ["search", "query", "find"],
    description: "Canada.ca search box with hidden label and icon submit.",
    defaultMarkup: `<form class="form-inline" role="search" action="#" method="get">
  <div class="form-group">
    <label for="search-example" class="wb-inv">Search Canada.ca</label>
    <input class="form-control" id="search-example" name="q" type="search" placeholder="Search Canada.ca" size="30">
  </div>
  <button type="submit" class="btn btn-primary" title="Search Canada.ca">Search<span class="glyphicon glyphicon-search"></span></button>
</form>`,
  },
  // ─── NAVIGATION ───────────────────────────────────────────────────────────
  {
    dir: "breadcrumb",
    name: "Breadcrumb trail",
    cls: "breadcrumb",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Pages deeper than two levels in the Canada.ca hierarchy"],
    avoidWhen: ["Top-level pages", "Transaction question flows — use back links"],
    agentPrompt: "Edit the trail links. The last item is the current page (no link, aria-current='page'). Breadcrumbs show hierarchy only, not transaction history.",
    preserve: [
      "nav with aria-label='Breadcrumb'",
      "ol.breadcrumb structure",
      "aria-current='page' on the last item"
    ],
    editable: ["Trail links"],
    limitations: ["Do not use for transaction steps — use explicit back links"],
    invariants: ["Breadcrumb landmark labelled"],
    related: ["header", "footer", "back-link"],
    tags: ["breadcrumb", "navigation", "hierarchy"],
    description: "Canada.ca breadcrumb trail for hierarchy context.",
    defaultMarkup: `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li><a href="#">Jobs and the workplace</a></li>
    <li aria-current="page">Finding a job</li>
  </ol>
</nav>`,
  },
  {
    dir: "back-link",
    name: "Back link",
    cls: "btn btn-link",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Returning to the previous question in a transaction flow"],
    avoidWhen: ["Hierarchical navigation — use breadcrumbs"],
    agentPrompt: "Set href to the previous step's URL. Keep the back-arrow glyph via CSS content, not an inline image.",
    preserve: ["Link semantics with meaningful accessible name"],
    editable: ["href", "Visible text"],
    limitations: ["Never replace browser back behaviour guarantees"],
    invariants: ["Semantic <a> with meaningful name"],
    related: ["breadcrumb", "button"],
    tags: ["back", "navigation", "transaction"],
    description: "Back navigation link for transactional flows.",
    defaultMarkup: `<a class="btn btn-link" href="/previous-step">
  <span aria-hidden="true">‹</span> Back to previous step
</a>`,
  },
  {
    dir: "pagination",
    name: "Pagination",
    cls: "pagination",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Paginated result lists", "Sequential content"],
    avoidWhen: ["Question flows — use buttons"],
    agentPrompt: "Edit page links. aria-current='page' on the active page. Previous/Next links carry visually-hidden context.",
    preserve: [
      "nav with aria-label='Pagination'",
      "ul.pagination structure",
      "aria-current='page' on the active item"
    ],
    editable: ["Page numbers", "hrefs", "Prev/next labels"],
    limitations: ["No dead links — honest page counts only"],
    invariants: ["Pagination landmark labelled"],
    related: ["table", "search"],
    tags: ["pagination", "pages", "results"],
    description: "Numbered pagination with previous/next controls.",
    defaultMarkup: `<nav aria-label="Pagination" role="navigation">
  <ul class="pagination">
    <li><a href="#" rel="prev" aria-label="Previous page">« Previous</a></li>
    <li class="active"><a href="#" aria-current="page">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#" rel="next" aria-label="Next page">Next »</a></li>
  </ul>
</nav>`,
  },
  {
    dir: "header",
    name: "GC header (signature + language toggle)",
    cls: "header",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — Government of Canada signature, language toggle, search"],
    avoidWhen: ["Never restyle the Canada wordmark or flag"],
    agentPrompt: "Keep the Government of Canada signature (wordmark + flag) and the language toggle (English/Français links). Set the search action. The signature links to canada.ca. Every page needs skip links (wb-slc) in the page markup — the Canada registry has no skiplinks tile, so add them above this header.",
    preserve: [
      "Government of Canada signature (wordmark + flag)",
      "Language toggle links (English/Français) — both must always be present",
      "Search form with hidden label"
    ],
    editable: ["Search action", "Menu links"],
    limitations: [
      "The Canada wordmark and flag are protected identity assets — never restyle or translate the signature",
      "Bilingual parity is mandatory: the toggle must offer the equivalent page in the other language"
    ],
    invariants: ["Language toggle present on every page", "Signature links to canada.ca"],
    related: ["language-toggle", "footer", "search"],
    tags: ["header", "signature", "wordmark", "language", "toggle", "identity"],
    description: "GC header with Canada signature, language toggle, and search.",
    defaultMarkup: `<header>
  <div id="wb-lng">
    <ul class="list-inline">
      <li><a href="#" lang="fr" hreflang="fr">Français</a></li>
    </ul>
  </div>
  <div class="brand">
    <a href="https://www.canada.ca/en.html">
      <span class="wb-inv">Government of Canada</span>
      <span class="flag"><span class="wb-inv">Symbol of the Government of Canada</span></span>
    </a>
  </div>
  <section class="gc-search">
    <form role="search" action="#" method="get">
      <label for="hdr-search" class="wb-inv">Search Canada.ca</label>
      <input id="hdr-search" name="q" type="search" class="form-control" placeholder="Search Canada.ca">
      <button type="submit" class="btn btn-primary" title="Search Canada.ca">Search</button>
    </form>
  </section>
</header>`,
  },
  {
    dir: "language-toggle",
    name: "Language toggle",
    cls: "lang-toggle",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "none",
    audit: false,
    useWhen: ["Every Canada.ca page — switching between the English and French versions of the current page"],
    avoidWhen: ["Never omit — the Official Languages Act requires bilingual parity"],
    agentPrompt: "The toggle link points at the equivalent page in the other language: 'Français' on English pages, 'English' on French pages. Keep lang and hreflang attributes.",
    preserve: [
      "lang attribute on the page html element",
      "hreflang on the toggle link",
      "Link text always names the OTHER language"
    ],
    editable: ["Target URL"],
    limitations: ["Both language versions must exist and be equivalent — a dead toggle fails the Official Languages Act"],
    invariants: ["Toggle present on every page", "Other-language page exists and is equivalent"],
    related: ["header", "footer"],
    tags: ["language", "bilingual", "toggle", "official-languages"],
    description: "EN/FR language toggle — mandatory on every Canada.ca page.",
    defaultMarkup: `<ul class="list-inline" id="wb-lng">
  <li><a href="#" lang="fr" hreflang="fr">Français</a></li>
</ul>
<!-- On the French page, the toggle reads:
<ul class="list-inline" id="wb-lng">
  <li><a href="#" lang="en" hreflang="en">English</a></li>
</ul> -->`,
  },
  {
    dir: "footer",
    name: "GC footer",
    cls: "footer",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — About government links, Canada wordmark"],
    avoidWhen: ["Do not place primary navigation here"],
    agentPrompt: "Keep the standard link set (About government, Contact us, News, Treaties, laws and regulations, Government-wide reporting, Prime Minister, Departments and agencies). The Canada wordmark closes the page.",
    preserve: [
      "Standard 'About government' link set",
      "Canada wordmark at page close"
    ],
    editable: ["Additional links", "Link URLs"],
    limitations: ["The wordmark is a protected identity asset"],
    invariants: ["Contentinfo landmark", "Wordmark present"],
    related: ["header", "date-modified"],
    tags: ["footer", "wordmark", "about", "legal"],
    description: "GC footer with About government links and Canada wordmark.",
    defaultMarkup: `<footer id="wb-info" class="footer">
  <h2 class="wb-inv">About this site</h2>
  <p class="brand">
    <span class="wb-inv">Symbol of the Government of Canada</span>
    <span class="flag"></span>
  </p>
  <nav aria-label="About this site">
    <ul class="list-inline">
      <li><a href="#">About government</a></li>
      <li><a href="#">Contact us</a></li>
      <li><a href="#">News</a></li>
      <li><a href="#">Treaties, laws and regulations</a></li>
      <li><a href="#">Departments and agencies</a></li>
    </ul>
  </nav>
</footer>`,
  },
  {
    dir: "date-modified",
    name: "Date modified",
    cls: "datemod",
    section: "navigation",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — mandatory content freshness indicator above the footer"],
    avoidWhen: ["Never omit on Canada.ca pages"],
    agentPrompt: "Set the real last-modified date. Label text must switch with page language (Date modified / Date de modification).",
    preserve: [
      "'Date modified:' label with the real date",
      "Position above the footer"
    ],
    editable: ["The date value"],
    limitations: ["Use the actual content change date — not the build date"],
    invariants: ["Date-modified indicator present on every page"],
    related: ["footer"],
    tags: ["date", "modified", "freshness", "mandatory"],
    description: "Mandatory content freshness indicator (Date modified).",
    defaultMarkup: `<section class="datemod">
  <h2 class="wb-inv">Date modified</h2>
  <p><strong>Date modified:</strong> 2026-09-06</p>
</section>`,
  },
  // ─── FEEDBACK ─────────────────────────────────────────────────────────────
  {
    dir: "alert",
    name: "Alert",
    cls: "alert",
    section: "feedback",
    requiresJs: "no",
    interaction: ["focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Page-level information, success, danger, or warning messages"],
    avoidWhen: ["Field-level errors — use inline error text in the form group", "Marketing content"],
    agentPrompt: "Variants: alert-info / alert-success / alert-danger / alert-warning. The h2 inside is the alert heading. Canada.ca has no global error summary — use a danger alert plus inline field errors for failed submissions.",
    preserve: [
      "section[role] semantics (alert for danger/warning)",
      "h2 heading inside the alert",
      "Variant class conveying the message type"
    ],
    editable: ["Heading text", "Body text", "Variant class"],
    limitations: ["Do not stack many alerts on one page"],
    invariants: ["Heading element inside the alert"],
    related: ["text-input", "table"],
    tags: ["alert", "info", "success", "danger", "warning"],
    description: "Info, success, danger, and warning alerts (alert).",
    variants: [
      {
        file: "info", variant: "info",
        desc: "Information alert.",
        markup: `<section class="alert alert-info">
  <h2>Information</h2>
  <p>The service will be unavailable on Sunday between 2 a.m. and 4 a.m.</p>
</section>`
      },
      {
        file: "success", variant: "success",
        desc: "Success alert.",
        markup: `<section class="alert alert-success" role="status">
  <h2>Thank you</h2>
  <p>Your request has been submitted.</p>
</section>`
      },
      {
        file: "danger", variant: "danger",
        desc: "Danger alert for failed submissions.",
        markup: `<section class="alert alert-danger" role="alert">
  <h2>Correct the following before submitting</h2>
  <p>Your application cannot be submitted until the errors are fixed.</p>
</section>`
      },
      {
        file: "warning", variant: "warning",
        desc: "Warning alert.",
        markup: `<section class="alert alert-warning" role="alert">
  <h2>Warning</h2>
  <p>This action cannot be undone.</p>
</section>`
      }
    ]
  },
  {
    dir: "details",
    name: "Details (expandable content)",
    cls: "details",
    section: "feedback",
    requiresJs: "no",
    interaction: ["click", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Progressive disclosure of secondary content (help text, definitions)"],
    avoidWhen: ["Critical information — keep it visible"],
    agentPrompt: "Native <details>/<summary> — no JS needed. Edit summary text and content. The GCWeb styling adds the plus/minus indicator.",
    preserve: ["Native <details>/<summary> elements"],
    editable: ["Summary text", "Content HTML"],
    limitations: ["Content hidden by default — never essential information"],
    invariants: ["Native details/summary semantics"],
    related: ["table", "alert"],
    tags: ["details", "expandable", "disclosure", "content"],
    description: "Native HTML details element styled for Canada.ca.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Expandable details with summary.",
        markup: `<details>
  <summary>Need help with your application?</summary>
  <p>If you have questions about the process, contact the program office at 1-800-O-Canada.</p>
</details>`
      }
    ]
  },
  // ─── DATA DISPLAY ─────────────────────────────────────────────────────────
  {
    dir: "table",
    name: "Table",
    cls: "table",
    section: "data-display",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Tabular data with a genuine row/column relationship", "Striped variant for easier row scanning"],
    avoidWhen: ["Lists that could be markup lists", "Layout purposes"],
    agentPrompt: "Edit headers and cells. Caption is mandatory. Add table-striped for row shading and table-hover for interactive scanning. Wrap wide tables in a responsive container.",
    preserve: [
      "<caption> element (mandatory)",
      "scope='col'/'row' on header cells",
      "thead/tbody structure"
    ],
    editable: ["Caption text", "Headers and cells", "Striped/hover modifiers"],
    limitations: ["Wide tables need a responsive wrapper for horizontal scrolling"],
    invariants: ["Caption present", "scope attributes on headers"],
    related: ["pagination", "search"],
    tags: ["table", "data", "numbers"],
    description: "Data table with caption and striped variant (table).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Data table with caption.",
        markup: `<div class="table-responsive">
  <table class="table">
    <caption>Benefits by family situation</caption>
    <thead>
      <tr>
        <th scope="col">Situation</th>
        <th scope="col">Weekly amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">One child</th>
        <td>$619.75</td>
      </tr>
      <tr>
        <th scope="row">Two children</th>
        <td>$1,239.50</td>
      </tr>
    </tbody>
  </table>
</div>`
      },
      {
        file: "striped", variant: "striped",
        desc: "Striped table for easier row scanning.",
        markup: `<div class="table-responsive">
  <table class="table table-striped">
    <caption>Processing times by region</caption>
    <thead>
      <tr>
        <th scope="col">Region</th>
        <th scope="col">Processing time</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Atlantic</th>
        <td>4 weeks</td>
      </tr>
      <tr>
        <th scope="row">Quebec</th>
        <td>6 weeks</td>
      </tr>
      <tr>
        <th scope="row">Prairies</th>
        <td>5 weeks</td>
      </tr>
    </tbody>
  </table>
</div>`
      }
    ]
  },
  {
    dir: "footnotes",
    name: "Footnotes",
    cls: "wb-fnotes",
    section: "data-display",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Citing sources or adding clarifying notes in policy and guidance content", "Verified against the WET-BOEW footnotes pattern"],
    avoidWhen: ["Short content where a parenthetical suffices"],
    agentPrompt: "In-body refs are sup.fn-lnk links (id=fnN-rf) targeting the note; each note ends with a fn-rtn link back to its referrer. Keep the return links — they preserve reading position.",
    preserve: [
      "aside[role='region'] with aria-labelledby pointing at the 'Footnotes' heading",
      "ol.footnotes structure with per-note ids (fnN-M)",
      "fn-lnk / fn-rtn link pairing between body and notes"
    ],
    editable: ["Note text", "Referrer anchors"],
    limitations: ["Bilingual parity: footnote labels (Note N / Retour à la référence N) must switch with page language"],
    invariants: ["Referrer/return link pairing is bidirectional", "Notes remain real list items"],
    related: ["table", "date-modified"],
    tags: ["footnotes", "citations", "references", "wet-boew"],
    description: "Footnote references and notes section (WET-BOEW footnotes pattern).",
    provenance: { observed: "2026-09-06", source: "https://wet-boew.github.io/wet-boew/demos/footnotes/footnotes-en.html (via web.archive.org — canada.ca direct fetches timed out)", method: "live-site observation" },
    variants: [
      {
        file: "default", variant: "default",
        desc: "In-body footnote referrer and the notes section.",
        markup: `<p class="example-body">Employment insurance rates are set annually.<sup class="fn-lnk" id="fn1-rf"><a class="fn-lnk" href="#fn1">1</a></sup> Rates vary by region.</p>

<aside class="wb-fnotes" role="region" aria-labelledby="fn-note">
  <h2 id="fn-note">Footnotes</h2>
  <ol class="footnotes">
    <li id="fn1">
      <p> EI premium rates are published each January. <a class="fn-rtn" href="#fn1-rf">Return to footnote 1 referrer</a></p>
    </li>
  </ol>
</aside>`
      }
    ]
  }
];
