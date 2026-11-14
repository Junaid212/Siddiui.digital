// Single source of truth for the approved SEO metadata of the nine main pages.
// Imported by the React pages (via HeadTitle) AND by scripts/prerender-pages.mjs,
// so the runtime tags and the prerendered initial HTML can never drift apart.
// Keep this file free of JSX / bundler-only imports (it is loaded by Node).

export const SITE_URL = "https://siddiqui.digital";
export const SITE_NAME = "Siddiqui Digital";

// These files exist in public/assets/images/img/ (1600x836).
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/img/main-ogimg.jpg`;
export const MR_OG_IMAGE = `${SITE_URL}/assets/images/img/mr-ogimg.jpg`;
export const OG_IMAGE_WIDTH = "1600";
export const OG_IMAGE_HEIGHT = "836";

export const PAGE_SEO = {
  home: {
    path: "/",
    title: "M. Q. Siddiqui | Marketing Reclassified | Siddiqui.digital",
    description:
      "Reclassifying marketing as governed strategic intelligence. Books, frameworks and advisory for leaders who want market evidence to shape their decisions.",
  },
  about: {
    path: "/about",
    title: "About M. Q. Siddiqui | Siddiqui.digital",
    description:
      "Author of Marketing Reclassified and originator of the Sid Philosophy, with nearly four decades across corporate practice, consulting and higher education.",
  },
  askSid: {
    path: "/ask-sid",
    title: "Ask SID | AI Companion to Marketing Reclassified",
    description:
      "Ask SID is the AI-powered companion to Marketing Reclassified, coming soon for Digital Companion Edition readers. Ask questions and explore the book’s ideas.",
  },
  frameworks: {
    path: "/frameworks",
    title: "Frameworks: Sid Approach, AVF and VDI | Siddiqui.digital",
    description:
      "Original frameworks by M. Q. Siddiqui: the Sid Approach, the Adaptive Value Framework, the Value Drift Index and From Purpose to Profit, built for leadership decisions.",
  },
  learning: {
    path: "/courses",
    title: "Learning Programs | Siddiqui.digital",
    description:
      "Learning programs built on the Marketing Reclassified frameworks, for leaders and professionals who want marketing to improve decisions. Join the waitlist.",
  },
  advisory: {
    path: "/consultation",
    title: "Strategic Advisory with M. Q. Siddiqui | Siddiqui.digital",
    description:
      "Advisory for leaders who want market evidence to shape decisions about customers, pricing, value and growth. Book a complimentary 30-minute conversation.",
  },
  contact: {
    path: "/contact",
    title: "Contact M. Q. Siddiqui | Siddiqui.digital",
    description:
      "Get in touch with M. Q. Siddiqui about advisory, speaking, learning programs or the book Marketing Reclassified. Based in the United Arab Emirates.",
  },
  blog: {
    path: "/blog-page",
    title: "SID Insights | Articles by M. Q. Siddiqui",
    description:
      "Articles on marketing, strategy and governance by M. Q. Siddiqui. New insights every week on bringing market evidence into the decisions leaders make.",
  },
  marketingReclassified: {
    path: "/publications/marketing-reclassified",
    title:
      "Marketing Reclassified: From Promotion to Governed Strategic Intelligence | M. Q. Siddiqui",
    description:
      "A practical guide for leaders on moving marketing from promotion to governed strategic intelligence, so market evidence shapes decisions before they are locked.",
    image: MR_OG_IMAGE,
    ogType: "book",
  },
};

// Canonical URLs always use the fixed production domain (never window.location.origin)
// and have no trailing slash, except the site root.
export const canonicalFor = (pathname) => {
  const clean = pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  return `${SITE_URL}${clean}`;
};

// og:type for a page. An explicit type always wins (e.g. "article" for blog posts);
// otherwise the long-standing default applies: "book" when a dedicated image is supplied
// (the Marketing Reclassified page), "website" for everything else.
export const resolveOgType = ({ type, image } = {}) => type || (image ? "book" : "website");

// Props for <HeadTitle />: {...seoProps("about")}
export const seoProps = (key) => {
  const p = PAGE_SEO[key];
  return {
    title: p.title,
    description: p.description,
    url: `${SITE_URL}${p.path === "/" ? "/" : p.path}`,
    image: p.image,
  };
};
