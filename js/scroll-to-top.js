export class ScrollToTop extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.classList.add("hidden");
		window.addEventListener("scroll", () => {
			if (window.scrollY >= window.screen.availHeight / 2) {
				this.classList.remove("hidden");
			} else this.classList.add("hidden");
		});
		this.innerHTML = "<span class='icon arrow up'></span>Scroll to Top";

		this.onclick = () => {
			window.scrollTo({ top: window.screenTop, behavior: "smooth" });
		};
	}
}
