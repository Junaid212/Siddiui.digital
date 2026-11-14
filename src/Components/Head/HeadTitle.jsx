import { useEffect } from "react";
import {
  PAGE_SEO,
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  canonicalFor,
  resolveOgType,
} from "../../Data/pageSeo";

const DEFAULT_TITLE = PAGE_SEO.home.title;
const DEFAULT_DESCRIPTION = PAGE_SEO.home.description;

const HeadTitle = ({ title, description, image, url, type }) => {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const pageImage = image || DEFAULT_OG_IMAGE;

    const pageUrl = url
      ? new URL(url, SITE_URL).href
      : canonicalFor(window.location.pathname);

    document.title = pageTitle;

    const setMeta = (attribute, key, content) => {
      let meta = document.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;

    setMeta("name", "description", pageDescription);

    setMeta("property", "og:type", resolveOgType({ type, image }));
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", pageDescription);
    setMeta("property", "og:image", pageImage);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:site_name", SITE_NAME);
    // Image size: known for the site's own images. For any other image (e.g. an article's social or cover
    // image) the real size is not known here, so no possibly-wrong size is declared. The prerendered page
    // already declares the real size for those.
    if (pageImage.startsWith(`${SITE_URL}/assets/`)) {
      setMeta("property", "og:image:width", OG_IMAGE_WIDTH);
      setMeta("property", "og:image:height", OG_IMAGE_HEIGHT);
    } else {
      document
        .querySelectorAll('meta[property="og:image:width"], meta[property="og:image:height"]')
        .forEach((n) => n.remove());
    }

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", pageDescription);
    setMeta("name", "twitter:image", pageImage);
    setMeta("name", "twitter:url", pageUrl);
  }, [title, description, image, url, type]);

  return null;
};

export default HeadTitle;
