import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import BuyBookCheckout from "../../Components/BuyBookCheckout";
import HeadTitle from "../../Components/Head/HeadTitle";

export default function BuyBookPage() {
    return (
        <>
            <HeadTitle title="Buy Book" />
            <BannerInnerSection title="Buy Book" currentPage="Checkout" />
            <BuyBookCheckout />
        </>
    );
}
