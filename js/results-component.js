import { allStubAppointments } from "./allAppointments.stub.js";
import {
	getSavedLocationsFromLocalStorage,
	getSavedPersonsFromLocalStorage,
} from "./helpers.js";
import { listLocations } from "./locations.js";

export class ResultsComponent extends HTMLElement {
	constructor() {
		super();
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
			return `https://ind-appointment-checker.herokuapp.com/${this.api}/${locationName}/${this.savedPersons}`;
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
			if (this.savedLocations)
				for (let location of this.savedLocations) {
					const url = buildURL(location);
					allAppointmentsByLocation[location] = [];

					const locationName = location.split("_").join(" ");
					const appointments = await fetchData(url);

					appointments.forEach((appointment) => {
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
					});

					allAppointmentsByLocation[location].sort(
						(a, b) => Number(a.date) - Number(b.date)
					);
				}

			allAppointments.sort((a, b) => Number(a.date) - Number(b.date));
			// allAppointmentsByLocation.sort((a, b) =>
			// 	a.key < b.key ? -1 : a.key > b.key ? 1 : 0
			// );
			return [allAppointments, allAppointmentsByLocation];
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
			this.innerHTML = `No locations have been chosen yet. Please choose at least one location to continue`;
			this.innerHTML += buttons;
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

		const [allAppointments, allAppointmentsByLocation] =
			await this.getAllAvailableAppointments();

		// const [allAppointments, allAppointmentsByLocation] = allStubAppointments;

		if (allAppointments.length < 1) {
			this.innerHTML = `No available appointments have been found at <strong><em>${chosenLocations}.</em></strong> for <strong>${
				this.savedPersons === 1 ? "1 person" : this.savedPersons + " persons"
			}.</strong>Try another location or try again later.`;
			this.innerHTML += buttons;
			return;
		}

		const firstAppointment = allAppointments[0];
		this.innerHTML = '<span class="divider"></span>';

		this.innerHTML += `
      <span>
        <p>
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
		this.innerHTML += buttons;

		this.innerHTML += '<span class="divider"></span>';

		// OTHER APPOINTMENTS
		const otherApptsWrapper = document.createElement("div");
		otherApptsWrapper.className = "other-appts__wrapper";
		const title = document.createElement("h2");
		title.innerText = "Other appointments available at selected locations";
		otherApptsWrapper.appendChild(title);

		for (const key in allAppointmentsByLocation) {
			const appointments = allAppointmentsByLocation[key];

			const locationWrapper = document.createElement("span");
			locationWrapper.innerHTML = `<h5>${key.split("_").join(" ")}</h5>`;

			if (appointments.length > 0) {
				for (let i = 0, n = appointments.length; i < n; i++) {
					console.log(appointments[i]);
					locationWrapper.innerHTML += `<p>${appointments[i].dateString} at ${appointments[i].startTime}</p>`;
					if (i > 3) i = appointments.length;
				}
			} else {
				locationWrapper.innerHTML += `<p>No appointments available</p>`;
			}
			otherApptsWrapper.appendChild(locationWrapper);
		}

		this.appendChild(otherApptsWrapper);
	}
}
