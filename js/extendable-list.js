export class ExtendableList extends HTMLElement {
	constructor() {
		super();
	}
	htmlChildren = [];
	setHTMLChildren(obj) {
		this.htmlChildren = Object.keys(obj).map((key) => obj[key]);
	}

	titleNode = "";
	setTitleNode() {
		this.titleNode = this.htmlChildren.find((el) =>
			el?.classList?.contains("title__wrapper")
		);
	}

	appointments = [];
	setAppointments() {
		this.appointments = this.querySelectorAll(".day__wrapper");
	}

	// default max number is 3
	setMaxAppointmentsShown() {
		const maxAppointmentsShown = { current: 3 };
		const decreaseAppointmentsShown = () => {
			console.log("decrease");
		};
		const increaseAppointmentsShown = () => {
			maxAppointmentsShown.current += 1;
			const allAppointmentDays = this.querySelectorAll(".day__wrapper");

			allAppointmentDays.forEach((el, key) => {
				if (key < maxAppointmentsShown.current) {
					el.classList.remove("hidden");
				}
			});

			// scroll with new additions
			// half of the row-gap of this wrapper;
			const magicNum = 16;

			// using scrollTo instead of scrollIntoView as safari doesn't accept params
			// accepting that this will not scroll for IE.
			window.scrollTo({
				top: this.offsetTop + this.offsetHeight - window.innerHeight + magicNum,
				behavior: "smooth",
			});
		};

		return [
			increaseAppointmentsShown,
			decreaseAppointmentsShown,
			maxAppointmentsShown,
		];
	}

	connectedCallback() {
		this.setHTMLChildren(this.childNodes);
		this.setTitleNode();
		this.setAppointments();
		this.innerHTML = "";

		this.append(this.titleNode);

		const [
			increaseAppointmentsShown,
			decreaseAppointmentsShown,
			maxAppointmentsShown,
		] = this.setMaxAppointmentsShown();

		const appointmentsWrapper = document.createElement("span");
		appointmentsWrapper.className = "appointments__wrapper";
		appointmentsWrapper.id = this.id + "_appointments__wrapper";

		for (let i = 0, n = this.appointments.length; i < n; i++) {
			if (i >= maxAppointmentsShown.current) {
				this.appointments[i].classList.add("hidden");
			}
			appointmentsWrapper.append(this.appointments[i]);
		}

		this.append(appointmentsWrapper);

		if (this.appointments.length > maxAppointmentsShown.current) {
			const showMoreBtn = document.createElement("button");
			showMoreBtn.className = "btn secondary";
			showMoreBtn.innerHTML = 'Show More <span class="icon plus small"></span>';
			const showMoreBtnID = this.titleNode.innerText + "show-more__btn";
			showMoreBtn.id = showMoreBtnID;
			showMoreBtn.onclick = increaseAppointmentsShown;

			this.append(showMoreBtn);
		}
	}
}
