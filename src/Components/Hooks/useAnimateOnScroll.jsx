import React from "react";
import { useEffect } from "react";

const useAnimateOnScroll = (selector = "[data-animate]") => {
  	useEffect(() => {
		const elements = document.querySelectorAll(selector);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const el = entry.target;
					const delay = el.getAttribute("data-delay") || 0;

					setTimeout(() => {
					const animateClass = el.getAttribute("data-animate");
					el.classList.add(animateClass);
					el.style.opacity = 1;
					observer.unobserve(el);
					}, delay);
				}
				});
			},
			{ threshold: 0.1 }
		);

		elements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [selector]);
}

export default useAnimateOnScroll;