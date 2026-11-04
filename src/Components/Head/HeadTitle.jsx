
import { useEffect } from "react";

const DEFAULT_TITLE = "Siddiqui.Digital | Business Solutions";
const DEFAULT_DESCRIPTION =
    "Empowering entrepreneurs and students through strategic marketing, business growth frameworks, and digital education.";
const DEFAULT_IMAGE =
    "https://siddiqui.digital/assets/images/og-image.jpg";
const DEFAULT_URL = "https://siddiqui.digital/";

const HeadTitle = ({ title, description, image, url }) => {
    useEffect(() => {
        const pageTitle = title || DEFAULT_TITLE;
        const pageDescription = description || DEFAULT_DESCRIPTION;
        const pageImage = image || DEFAULT_IMAGE;
        const pageUrl = url || (
            typeof window !== "undefined"
                ? window.location.href
                : DEFAULT_URL
        );

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

        setMeta("name", "description", pageDescription);

        setMeta("property", "og:type", image ? "article" : "website");
        setMeta("property", "og:title", pageTitle);
        setMeta("property", "og:description", pageDescription);
        setMeta("property", "og:image", pageImage);
        setMeta("property", "og:url", pageUrl);
        setMeta("property", "og:site_name", "Siddiqui Digital");

        setMeta("name", "twitter:card", "summary_large_image");
        setMeta("name", "twitter:title", pageTitle);
        setMeta("name", "twitter:description", pageDescription);
        setMeta("name", "twitter:image", pageImage);

        setMeta("name", "twitter:url", pageUrl);

    }, [title, description, image, url]);

    return null;
};

export default HeadTitle;
