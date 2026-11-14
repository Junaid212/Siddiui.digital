import React from "react";
import HeadTitle from "../../Components/Head/HeadTitle";
import AskSid from "../../Components/AskSid";
import { seoProps } from "../../Data/pageSeo";

export default function AskSidPage() {
  return (
    <>
      <HeadTitle {...seoProps("askSid")} />
      <AskSid />
    </>
  );
}
