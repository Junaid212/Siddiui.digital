import React from "react";
import { useOffer } from "./useOffer";

/**
 * Turns the administrator's text into React nodes. **double asterisks** make text bold. If the administrator used no
 * markup, a coupon written as "code LAUNCH30" is still made bold automatically.
 */
export function renderOfferText(text) {
  const raw = String(text || "");
  const marked = raw.includes("**")
    ? raw
    : raw.replace(/(\bcode\s+)([A-Z0-9_-]{3,40})\b/, "$1**$2**");
  return marked.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={i} style={{ fontWeight: 800, letterSpacing: "0.02em" }}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/**
 * Slim offer banner shown above the hero of the Marketing Reclassified landing page.
 * The wording, colours and on/off switch are edited by an administrator (dashboard > Products > Launch offer).
 * If the setting cannot be loaded, or the offer has ended, nothing is shown (a stale offer is worse than no banner).
 */
export default function OfferBanner() {
  const offer = useOffer();
  if (!offer || !offer.enabled || typeof offer.text !== "string" || !offer.text.trim()) return null;

  return (
    <div
      role="note"
      aria-label="Launch offer"
      data-testid="offer-banner"
      className="offer-banner"
      style={{
        background: offer.backgroundColor || "#A3192F",
        color: offer.textColor || "#FFFFFF",
        textAlign: "center",
        padding: "13px 18px",
        fontSize: "1.1rem",
        lineHeight: 1.45,
        fontWeight: 500,
      }}
    >
      {renderOfferText(offer.text)}
      <style>{`@media (max-width: 640px){.offer-banner{font-size:0.98rem !important;padding:11px 14px !important}}`}</style>
    </div>
  );
}
