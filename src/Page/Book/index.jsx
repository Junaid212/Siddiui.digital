import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import Ebooks from "../../Components/Ebooks";
import HeadTitle from "../../Components/Head/HeadTitle";

export default function BookPage() {
  
  return (
    <>
    <HeadTitle title="Siddiqui.Digital"/>
    <BannerInnerSection title="Books and Digital Publications" currentPage="Books and Digital Publications" />
    <Ebooks />
    </>
  );
}