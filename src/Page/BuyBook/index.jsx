
import React from "react";
import { useParams } from "react-router-dom";
import BuyBookCheckout from "../../Components/BuyBookCheckout";
import OfferBanner from "../../Components/OfferBanner";
import HeadTitle from "../../Components/Head/HeadTitle";
import { PAGE_SEO, SITE_URL } from "../../Data/pageSeo";

const MR = PAGE_SEO.marketingReclassified;
const PUBLICATION_TITLE = MR.title;
const PUBLICATION_DESCRIPTION = MR.description;
const PUBLICATION_IMAGE = MR.image;

export default function BuyBookPage() {
  const { slug, id } = useParams();

  const isMarketingReclassified =
    slug === "marketing-reclassified";

  return (
    <>
      <HeadTitle
        title={
          isMarketingReclassified
            ? PUBLICATION_TITLE
            : "Digital Publications | M. Q. Siddiqui"
        }
        description={
          isMarketingReclassified
            ? PUBLICATION_DESCRIPTION
            : undefined
        }
        image={
          isMarketingReclassified
            ? PUBLICATION_IMAGE
            : undefined
        }
        url={
          isMarketingReclassified
            ? `${SITE_URL}${MR.path}`
            : undefined
        }
      />
      {isMarketingReclassified && <OfferBanner />}
      <BuyBookCheckout />
    </>
  );
}
