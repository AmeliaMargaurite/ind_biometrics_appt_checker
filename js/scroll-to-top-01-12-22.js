import { throttleFunction } from "./helpers-01-12-22.js";

export class ScrollToTop extends HTMLElement {
	constructor() {
		super();
	}

	onScroll(self) {
		if (window.scrollY >= window.screen.availHeight / 2) {
			self.classList.remove("hidden");
		} else self.classList.add("hidden");
	}

	onClick() {
		window.scrollTo({ top: window.screenTop, behavior: "smooth" });
	}

	connectedCallback() {
		this.classList.add("hidden");

		window.addEventListener(
			"scroll",
			throttleFunction(() => this.onScroll(this), 100)
		);

		this.innerHTML = "<span class='icon arrow up'></span>Scroll to Top";

		this.onclick = this.onClick;
	}

	disconnectedCallback() {
		window.removeEventListener(
			"scroll",
			throttleFunction(() => this.onScroll(this), 100)
		);
	}
}
