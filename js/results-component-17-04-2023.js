import { allStubAppointments } from "./allAppointments.stub.js";
import {
	getBooleanFromString,
	getSavedLocationsFromLocalStorage,
	getSavedPersonsFromLocalStorage,
} from "./helpers-01-12-22.js";
import { listLocations } from "./locations-2.js";
import {
	getAllUniqueDays,
	getAppointmentsGroupedOrderedByQuantity,
	getAppointmentsPerUniqueDay,
} from "./results_helpers.js";

export class ResultsComponent extends HTMLElement {
	static get observedAttributes() {
		return ["loading"];
	}
	constructor() {
		super();
	}

	loading = true;
	setLoading(state) {
		if (typeof state === "boolean") {
			this.setAttribute("loading", state);
		}
	}

	setLoaderDisplay(state) {
		if (state) {
			const loader = document.getElementById("loading__wrapper");
			loader.style.display = "block";
		} else {
			const loader = document.getElementById("loading__wrapper");
			loader.style.display = "none";
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "loading" && getBooleanFromString(newValue) == false) {
			this.setLoaderDisplay(false);
		} else if (name === "loading" && getBooleanFromString(newValue) == true) {
			this.setLoaderDisplay(true);
		}
	}

	api = null;
	setApi(api) {
		this.api = api;
	}

	availableLocations = [];
	setAvailableLocations() {
		this.api !== "BIO"
			? (this.availableLocations = [
					listLocations[0],
					listLocations[1],
					listLocations[2],
					listLocations[3],
			  ])
			: (this.availableLocations = listLocations);
	}

	savedPersons = null;
	savedLocations = [];

	setSavedPersons() {
		this.savedPersons = getSavedPersonsFromLocalStorage(this.api);
	}

	setSavedLocations() {
		this.savedLocations = getSavedLocationsFromLocalStorage(this.api);
	}

	getAllAvailableAppointments = async () => {
		const buildURL = (locationName) => {
			const locationKey = listLocations.find(
				(location) => location.name === locationName
			);
			return `https://ind-checker-server.ameliamargaurite.dev/${this.api}/${locationName}/${this.savedPersons}`;
		};

		const fetchData = async (url) => {
			let response;
			try {
				response = await fetch(url, {
					method: "GET",
				});

				if (response.status >= 200 && response.status <= 299) {
					return response.json();
				}
			} catch (error) {
				console.error(error);
			}
			const error = await response;
			console.error(error);
		};

		const requestAllSortedData = async () => {
			const allAppointments = [];
			const allAppointmentsByLocation = new Object();

			if (this.savedLocations)
				for (let location of this.savedLocations) {
					const url = buildURL(location);
					allAppointmentsByLocation[location] = [];

					const locationName = location.split("_").join(" ");
					const appointments = await fetchData(url);
					if (appointments) {
						appointments.forEach((appointment) => {
							const dateString = new Date(appointment.date).toDateString();
							const date = new Date(
								appointment.date + " " + appointment.startTime
							);

							allAppointments.push({
								key: location,
								location: locationName,
								date: date,
								dateString: dateString,
								startTime: appointment.startTime,
							});

							allAppointmentsByLocation[location].push({
								key: location,
								location: locationName,
								date: date,
								dateString: dateString,
								startTime: appointment.startTime,
							});
						});
					}

					allAppointmentsByLocation[location].sort(
						(a, b) => Number(a.date) - Number(b.date)
					);
				}

			allAppointments.sort((a, b) => Number(a.date) - Number(b.date));
			this.setLoading(false);
			if (allAppointments.length > 0) {
				return [allAppointments, allAppointmentsByLocation];
			} else return null;
		};

		return requestAllSortedData();
	};

	async connectedCallback() {
		// START
		const api = this.dataset.api;
		this.setApi(api);
		this.setAvailableLocations();
		this.setSavedPersons();
		this.setSavedLocations();

		// BUTTONS
		const buttons = `
      <span class="buttons__wrapper">
				<button
					class="btn"
					id="choose_locations"
					onclick="openModal('choose-locations')"
				>
					Choose locations
				</button>
				<button
					class="btn"
					id="persons_attending"
					onclick="openModal('persons-attending')"
				>
					Persons attending
				</button>
			</span>
    `;

		if (this.savedLocations.length < 1) {
			this.innerHTML = `<p class="results__text">No locations have been chosen yet. Please choose at least one location to continue</p>`;
			this.innerHTML += buttons;
			this.setLoading(false);
			return;
		}

		let chosenLocations = "";

		for (const key in this.savedLocations) {
			const location = this.savedLocations[key];
			const name = location.split("_").join(" ");

			if (this.savedLocations.length === this.availableLocations.length) {
				chosenLocations = "any location";
				continue;
			} else if (this.savedLocations.length === 1) {
				chosenLocations += name;
			} else if (key != this.savedLocations.length - 1) {
				chosenLocations += name + ", ";
			} else {
				chosenLocations += "and " + name;
			}
		}

		const appointmentData = await this.getAllAvailableAppointments();

		if (!appointmentData) {
			this.innerHTML =
				"<h1>Whoops, an error has occurred</h1><p>How embarrassing. We'll get to fixing it straight away. Please try again soon.</p>";
			this.setLoading(false);

			return;
		}

		const [allAppointments, allAppointmentsByLocation] = appointmentData;

		if (allAppointments.length < 1) {
			this.innerHTML = `<p class="results__text">No available appointments have been found at <strong><em>${chosenLocations}.</em></strong> for <strong>${
				this.savedPersons === 1 ? "1 person" : this.savedPersons + " persons"
			}.</strong>Try another location or try again later.`;
			this.innerHTML += buttons;
			return;
		}

		const firstAppointment = allAppointments[0];

		const mainResultsWrapper = document.createElement("div");
		mainResultsWrapper.className = "main-results__wrapper";

		mainResultsWrapper.innerHTML = `
      <span>
        <p class="results__text">
          The next available appointment at <strong> ${chosenLocations} </strong> for <strong>${
			this.savedPersons === 1 ? "1 person" : this.savedPersons + " persons"
		}</strong> is:
        </p>
        <span class="result">
          ${firstAppointment.dateString}, ${firstAppointment.startTime} at ${
			firstAppointment.location
		} 
        </span>
      </span>
    `;
		mainResultsWrapper.innerHTML += buttons;
		this.append(mainResultsWrapper);

		// OTHER APPOINTMENTS
		const otherApptsWrapper = document.createElement("div");
		otherApptsWrapper.className = "other-appts__wrapper";
		const title = document.createElement("h2");
		title.innerText =
			"Other appointments available at the selected location(s)";
		otherApptsWrapper.appendChild(title);

		const orderedAppointmentsByLocation =
			getAppointmentsGroupedOrderedByQuantity(allAppointmentsByLocation);

		for (const key in orderedAppointmentsByLocation) {
			const appointments = orderedAppointmentsByLocation[key];
			const locationWrapper = document.createElement("extendable-list");
			locationWrapper.id = key.split("_").splice(1).join("_");
			const uniqueDays = getAllUniqueDays(appointments);

			// strips the number used for ordering list, gives just the location title.
			const locationTitle = key.split("_").splice(1).join(" ");

			locationWrapper.innerHTML = `
        <div class="title__wrapper">
          <h5 class="title">${locationTitle}</h5>
          <span class="subtext">
          ${
						appointments.length ? appointments.length : "0"
					} appointments available across ${uniqueDays.length} days 
          </span>
        </div>
      `;

			if (appointments.length > 0) {
				const appointmentsPerUniqueDay = getAppointmentsPerUniqueDay(
					uniqueDays,
					appointments
				);

				for (const day of uniqueDays) {
					const dayTitle = document.createElement("p");
					dayTitle.className = "day__title";
					dayTitle.id = day;
					dayTitle.innerHTML = day;

					const daysAppointments = appointmentsPerUniqueDay[day];
					const dayWrapper = document.createElement("span");
					dayWrapper.className = "day__wrapper";

					dayWrapper.append(dayTitle);

					for (let i = 0, n = daysAppointments.length; i < n; i++) {
						dayWrapper.innerHTML += `
          <p class="appointment">${daysAppointments[i].startTime}</p>
          `;
					}
					locationWrapper.append(dayWrapper);
				}
			} else {
				locationWrapper.innerHTML += `<p>No appointments available</p>`;
			}
			otherApptsWrapper.appendChild(locationWrapper);
		}
		this.appendChild(otherApptsWrapper);
	}
}

class ExtendableList extends HTMLElement {
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
		const increaseAppointmentsShown = (showMoreBtnID) => {
			maxAppointmentsShown.current += 1;
			const allAppointmentDays = this.querySelectorAll(".day__wrapper");

			allAppointmentDays.forEach((el, key) => {
				if (key < maxAppointmentsShown.current) {
					el.classList.remove("hidden");
				}
			});
			const test = this;
			// scroll with new additions

			const btn = document.getElementById(showMoreBtnID);

			// half of the row-gap of this wrapper;
			const magicNum = 16;

			// using scrollTo instead of scrollIntoView as safari doesn't accept params
			// accepting that this will not scroll for IE.
			window.scrollTo({
				top: this.offsetTop + this.offsetHeight - window.innerHeight + magicNum,
				behavior: "smooth",
			});

			if (this.appointments.length <= maxAppointmentsShown.current) {
				btn.remove();
			}
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
			showMoreBtn.onclick = () => increaseAppointmentsShown(showMoreBtnID);

			this.append(showMoreBtn);
		}
	}
}

customElements.define("extendable-list", ExtendableList);
