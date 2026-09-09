import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import OrderSuccess from "../../Components/OrderSuccess";
import HeadTitle from "../../Components/Head/HeadTitle";

export default function OrderSuccessPage() {
    return (
        <>
            <HeadTitle title="Order Confirmation | Siddiqui.Digital" />
            <BannerInnerSection title="Order Confirmation" currentPage="Digital Delivery" />
            <OrderSuccess />
        </>
    );
}
