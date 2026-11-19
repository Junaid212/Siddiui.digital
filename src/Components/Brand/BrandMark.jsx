import React, { useLayoutEffect, useRef } from "react";

/**
 * The logo text: "SIDDIQUI.DIGITAL" with "STRATEGIC INTELLIGENCE" under it. The tagline must be EXACTLY as wide as the name line, on every
 * screen (the name changes size with the screen, and fonts load a moment after the page), so a fixed letter-spacing can never line up.
 * This measures the name line and spaces the tagline's letters to match it, again whenever the size changes or the fonts arrive.
 * If anything goes wrong the page's own CSS spacing stays, so the logo is never broken.
 */
const TAGLINE = "STRATEGIC INTELLIGENCE";

// the width of a piece of text itself (an element in a column layout is stretched to its container, so its own box says nothing)
function textWidth(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

export default function BrandMark() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const box = root.current;
    if (!box || typeof document === "undefined") return undefined;
    const name = box.querySelector(".brand-name-2");
    const tag = box.querySelector(".brand-tagline");
    if (!name || !tag) return undefined;

    let frame = 0;
    const fit = () => {
      try {
        tag.style.setProperty("letter-spacing", "0px", "important");
        tag.style.setProperty("margin-right", "0px");
        const target = textWidth(name);
        const natural = textWidth(tag);
        const gaps = TAGLINE.length - 1;
        if (!(target > 0) || !(natural > 0) || gaps < 1) throw new Error("not measurable");
        const spacing = (target - natural) / gaps;
        if (!Number.isFinite(spacing) || spacing < 0 || spacing > 40) throw new Error("unreasonable spacing");
        // spacing after every letter, including the last one: pull that last bit back so the box ends where the last letter ends
        tag.style.setProperty("letter-spacing", `${spacing}px`, "important");
        tag.style.setProperty("margin-right", `${-spacing}px`);
        tag.style.alignSelf = "flex-start";
        tag.style.textAlign = "left";
      } catch {
        tag.style.removeProperty("letter-spacing");
        tag.style.removeProperty("margin-right");
        tag.style.removeProperty("text-align");
        tag.style.removeProperty("align-self");
      }
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); };

    fit();
    window.addEventListener("resize", schedule);
    let observer = null;
    if (typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(schedule); observer.observe(name); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule).catch(() => {});
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); if (observer) observer.disconnect(); };
  }, []);

  return (
    <div className="navbar-brand-text" ref={root}>
      <span className="brand-name-2">SIDDIQUI<span className="brand-name">.DIGITAL</span></span>
      <span className="brand-tagline">{TAGLINE}</span>
    </div>
  );
}
