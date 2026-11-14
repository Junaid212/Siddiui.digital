import { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * Launch offer settings from the admin dashboard (banner + Digital Companion button offer).
 * { offer, loaded }: offer is null until loaded, and stays null if the settings cannot be loaded - the page then simply
 * shows no offer.
 */
export function useOfferStatus() {
  const [state, setState] = useState({ offer: null, loaded: false });
  useEffect(() => {
    let alive = true;
    api.getOfferBanner().then((o) => { if (alive) setState({ offer: o && typeof o === "object" ? o : null, loaded: true }); });
    return () => { alive = false; };
  }, []);
  return state;
}

export function useOffer() {
  return useOfferStatus().offer;
}
