import React from "react";
import { useEffect, useMemo } from "react";
import Odometer from "odometer";
import "odometer/themes/odometer-theme-default.css";

const useCounterOnScroll = (ref, value, duration = 2000) => {
	const { displayValue, suffix, format } = useMemo(() => {
		// Default values
		let computedValue = value;
		let computedSuffix = "";
		let computedFormat = "(,ddd)";

		if (typeof value === "number" && value >= 1000 && value < 1000000) {
		// Format thousands to one decimal (e.g., 1500 -> 1.5K)
		const thousands = value / 1000;
		const roundedToOneDecimal = Math.round(thousands * 10) / 10;
		computedValue = roundedToOneDecimal;
		computedSuffix = "K";
		computedFormat = Number.isInteger(roundedToOneDecimal)
			? "(,ddd)"
			: "(,ddd).d";
		}

		return {
		displayValue: computedValue,
		suffix: computedSuffix,
		format: computedFormat,
		};
	}, [value]);

	useEffect(() => {
		if (!ref.current) return;

		const element = ref.current;

		// Observer if element on view
		const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Odometer initialization
				const od = new Odometer({
				el: element,
				value: 0,
				duration,
				format,
				theme: "default",
				});

				// Update to value target
				od.update(displayValue);

				// Stop observe after once animation display
				observer.disconnect();
			}
			});
		},
		{ threshold: 0.5 } // trigger on 50% of visible elements
		);

		observer.observe(element);

		return () => {
		observer.disconnect();
		};
	}, [ref, displayValue, duration, format]);

	return { suffix };
};

export default useCounterOnScroll;
