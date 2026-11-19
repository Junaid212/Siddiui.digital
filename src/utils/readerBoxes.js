// readerBoxes.js - shows the book's "Lens", "Field Note" and "Key Ideas" boxes as boxes (light background + border) in the online reader.
// Presentation only: the stored chapter text is never changed. The Word import keeps these boxes as a heading (or a bold label) followed by their
// text, so the reader recognises the label and wraps it together with what belongs to it:
//   Lens / Field Note : the label and everything after it up to the next heading (or the next box)
//   Key Ideas         : the label and its list (the bullets), then the box ends, so ordinary text after the list stays outside the box
// Anything that does not start with one of these labels is left exactly as it was.
const KINDS = [
  { kind: "lens", re: /^lens\b/i },
  { kind: "field-note", re: /^field notes?\b/i },
  { kind: "key-ideas", re: /^key ideas?\b/i },
];

const text = (el) => (el.textContent || "").replace(/\s+/g, " ").trim();
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
const isList = (el) => /^(UL|OL)$/.test(el.tagName);

/** The kind of box this element opens, or null. A heading (H2-H4), or a SHORT paragraph whose label is in bold. */
function boxKind(el) {
  if (!el || el.nodeType !== 1) return null;
  const t = text(el);
  if (!t) return null;
  const hit = KINDS.find((k) => k.re.test(t));
  if (!hit) return null;
  if (/^H[2-4]$/.test(el.tagName)) return hit.kind;
  if (el.tagName === "P" && t.length <= 90 && el.querySelector("strong, b")) return hit.kind;
  return null;
}

export function decorateBoxes(html) {
  if (!html || !/lens|field note|key idea/i.test(html)) return html;
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const kids = Array.from(doc.body.children);
  for (let i = 0; i < kids.length; i++) {
    const start = kids[i];
    if (!start.parentNode || start.parentNode !== doc.body) continue; // already moved into an earlier box
    const kind = boxKind(start);
    if (!kind) continue;
    const box = doc.createElement("div");
    box.className = `reader-box reader-box--${kind}`;
    box.setAttribute("data-box", kind);
    doc.body.insertBefore(box, start);
    box.appendChild(start);
    let sawList = false;
    for (let j = i + 1; j < kids.length; j++) {
      const next = kids[j];
      if (isHeading(next) || boxKind(next)) break;
      if (kind === "key-ideas") {
        if (sawList && !isList(next)) break;
        if (isList(next)) sawList = true;
      }
      box.appendChild(next);
    }
  }
  return doc.body.innerHTML;
}
