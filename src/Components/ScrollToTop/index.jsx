import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Every time the visitor goes to another page, the new page opens at the TOP.
 *
 * It used to scroll up with `behavior: "smooth"` after the page had changed. A smooth scroll is an animation that any later layout
 * change (images and data arriving, the page growing) can interrupt, so some pages opened wherever the previous page had been
 * scrolled to. Now the jump is instant and happens before the new page is painted. Links that point to a place INSIDE a page
 * (a "#section" address) are left alone so they still scroll to that section.
 */
const jumpToTop = () => {
  const root = document.documentElement;
  const previous = root.style.getPropertyValue("scroll-behavior");
  const previousPriority = root.style.getPropertyPriority("scroll-behavior");
  // the stylesheet sets "smooth" for the whole page (possibly with !important): switch that off for this jump only
  root.style.setProperty("scroll-behavior", "auto", "important");
  window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // an explicit "instant" beats any stylesheet
  document.body.scrollTop = 0;
  if (previous) root.style.setProperty("scroll-behavior", previous, previousPriority); else root.style.removeProperty("scroll-behavior");
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // The browser must not put the old scroll position back on its own (it does so on some pages and not on others).
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    if (hash && hash.length > 1) {
      let target = null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { /* bad escape: ignore */ }
      if (target) { target.scrollIntoView(); return undefined; }
    }
    jumpToTop();
    // pages whose content arrives a moment later can leave the scroll position behind: check once more on the next frame
    const frame = window.requestAnimationFrame(() => { if (window.scrollY > 0 && !hash) jumpToTop(); });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]); // (not the ?search part: filters on a page should not throw the visitor back to the top)

  return null;
};

export default ScrollToTop;
