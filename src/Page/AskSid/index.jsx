import React, { useEffect } from "react";
import HeadTitle from "../../Components/Head/HeadTitle";
import AskSid from "../../Components/AskSid";

export default function AskSidPage() {
  useEffect(() => {
    // Dynamic meta description update for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Ask SID is the digital companion to Marketing Reclassified, helping readers explore marketing and business challenges through the principles of the book.";
  }, []);

  return (
    <>
      <HeadTitle title="Ask SID | Marketing Reclassified | Siddiqui.digital" />
      <AskSid />
    </>
  );
}
