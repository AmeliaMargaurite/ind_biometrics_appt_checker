import { allStubAppointments } from "./allAppointments.stub.js";
import {
	getSavedLocationsFromLocalStorage,
	getSavedPersonsFromLocalStorage,
} from "./helpers.js";
import { listLocations } from "./locations.js";
import {
	getAllUniqueDays,
	getAppointmentsGroupedOrderedByQuantity,
	getAppointmentsPerUniqueDay,
} from "./results_helpers.js";

export class ResultsComponent extends HTMLElement {
	static get observedAttributes() {
		return ["status"];
	}
	constructor() {
		super();
		const attributeChangedCallback = (name, old, newThing) => {
			console.log("boopey doop");
		};

		const shadow = this.attachShadow({ mode: "open" });

		const cssLink = document.createElement("link");
		cssLink.setAttribute("rel", "stylesheet");
		cssLink.setAttribute("href", "../css/main.css");
		shadow.append(cssLink);

		const api = this.dataset.api;

		const availableLocations = [];
		const setAvailableLocations = () => {
			api !== "BIO"
				? (availableLocations = [
						listLocations[0],
						listLocations[1],
						listLocations[2],
						listLocations[3],
				  ])
				: (availableLocations = listLocations);
		};

		const savedPersons = getSavedPersonsFromLocalStorage(api);
		const savedLocations = getSavedLocationsFromLocalStorage(api);

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

		const getAllAvailableAppointments = async () => {
			const buildURL = (locationName) => {
				return `https://ind-appointment-checker.herokuapp.com/${api}/${locationName}/${savedPersons}`;
			};

			const fetchData = async (url) => {
				const response = await fetch(url, {
					method: "GET",
				}).then((resp) => resp.text());
				return JSON.parse(response);
			};

			const requestAllSortedData = async () => {
				const allAppointments = [];
				const allAppointmentsByLocation = new Object();
				if (savedLocations)
					for (let location of savedLocations) {
						const url = buildURL(location);
						allAppointmentsByLocation[location] = [];

						const locationName = location.split("_").join(" ");
						const appointments = await fetchData(url);

						for (const appointment of appointments) {
							const dateString = new Date(appointment.date).toDateString();
							const date = new Date(appointment.date);

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
						}

						allAppointmentsByLocation[location].sort(
							(a, b) => Number(a.date) - Number(b.date)
						);
					}

				allAppointments.sort((a, b) => Number(a.date) - Number(b.date));

				return [allAppointments, allAppointmentsByLocation];
			};

			return requestAllSortedData();
		};

		const renderAppointmentData = async (chosenLocations) => {
			// GET APPOINTMENT DATA

			// const [allAppointments, allAppointmentsByLocation] =
			// 	await this.getAllAvailableAppointments();
			const [allAppointments, allAppointmentsByLocation] =
				await allStubAppointments;

			if (allAppointments.length < 1) {
				shadow.innerHTML = `No available appointments have been found at <strong><em>${chosenLocations}.</em></strong> for <strong>${
					savedPersons === 1 ? "1 person" : savedPersons + " persons"
				}.</strong>Try another location or try again later.`;
				shadow.innerHTML += buttons;
				return;
			}

			const firstAppointment = allAppointments[0];

			const mainResultsWrapper = document.createElement("div");
			mainResultsWrapper.className = "main-results__wrapper";

			mainResultsWrapper.innerHTML = `
      <span>
        <p>
          The next available appointment at <strong> ${chosenLocations} </strong> for <strong>${
				savedPersons === 1 ? "1 person" : savedPersons + " persons"
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
			shadow.append(mainResultsWrapper);

			// OTHER APPOINTMENTS
			const otherApptsWrapper = document.createElement("div");
			otherApptsWrapper.className = "other-appts__wrapper";
			const title = document.createElement("h2");
			title.innerText = "Other appointments available at selected locations";
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
          <p class="appointment">${appointments[i].startTime}</p>
          `;
						}
						locationWrapper.append(dayWrapper);
					}
				} else {
					locationWrapper.innerHTML += `<p>No appointments available</p>`;
				}
				otherApptsWrapper.appendChild(locationWrapper);
			}
			shadow.appendChild(otherApptsWrapper);
			this.setAttribute("status", "complete");
		};

		// START

		// CHECK IF LOCATION CHOSEN
		if (savedLocations.length < 1) {
			shadow.innerHTML = `No locations have been chosen yet. Please choose at least one location to continue`;
			shadow.innerHTML += buttons;
			return;
		}

		// SHOW ALL CHOSEN LOCATIONS TO USER
		let chosenLocations = "";

		for (const key in savedLocations) {
			const location = savedLocations[key];
			const name = location.split("_").join(" ");

			if (savedLocations.length === availableLocations.length) {
				chosenLocations = "any location";
				continue;
			} else if (savedLocations.length === 1) {
				chosenLocations += name;
			} else if (key != savedLocations.length - 1) {
				chosenLocations += name + ", ";
			} else {
				chosenLocations += "and " + name;
			}
		}

		renderAppointmentData(chosenLocations);
	}

	connectedCallback() {}
}
