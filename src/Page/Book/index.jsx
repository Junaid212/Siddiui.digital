import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import Ebooks from "../../Components/Ebooks";


export default function BookPage() {
  
  return (
    <>
    <BannerInnerSection title="Featured Books" currentPage="Books" />
    <Ebooks />
    </>
  );
}