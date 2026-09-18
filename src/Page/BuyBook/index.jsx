import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BuyBookCheckout from "../../Components/BuyBookCheckout";
import HeadTitle from "../../Components/Head/HeadTitle";
import { api } from "../../api";

export default function BuyBookPage() {
    const { slug, id } = useParams();
    const [pageTitle, setPageTitle] = useState("Digital Publications — Siddiqui.Digital");

    useEffect(() => {
        async function fetchTitle() {
            try {
                let res = null;
                if (slug) res = await api.getProductBySlug(slug);
                if (!res && id) res = await api.getProductById(id);
                if (res && (res.product || (res.products && res.products[0]))) {
                    const p = res.product || res.products[0];
                    if (p && p.title) {
                        setPageTitle(`${p.title} — Siddiqui.Digital`);
                    }
                }
            } catch (e) {
                setPageTitle("Digital Publications — Siddiqui.Digital");
            }
        }
        fetchTitle();
    }, [slug, id]);

    return (
        <>
            <HeadTitle title={pageTitle} />
            <BuyBookCheckout />
        </>
    );
}
