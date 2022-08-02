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

	savedPersons = getSavedPersonsFromLocalStorage();
	savedLocations = getSavedLocationsFromLocalStorage();

	getAllAvailableAppointments = async () => {
		const persons = this.savedPersons;
		const locations = this.savedLocations;

		const buildURL = (locationName, persons) => {
			return `https://ind-appointment-checker.herokuapp.com/${locationName}/${persons}`;
		};

		const fetchData = async (url) => {
			const response = await fetch(url, {
				method: "GET",
			}).then((resp) => resp.text());
			return JSON.parse(response);
		};

		const requestAllSortedData = async () => {
			const allAppointments = [];

			if (locations)
				for (let location of locations) {
					const url = buildURL(location, this.savedPersons);

					const locationName = location.split("_").join(" ");
					const appointments = await fetchData(url);
					appointments.forEach((appointment) => {
						allAppointments.push({
							location: locationName,
							date: new Date(appointment.date).toDateString(),
							startTime: appointment.startTime,
						});
					});
				}

			console.log(allAppointments);
			const sortedAppointments = allAppointments.sort(
				(a, b) => Number(a.date) - Number(b.date)
			);
			console.log(sortedAppointments);

			return allAppointments.sort(
				(a, b) => Number(new Date(a.date)) - Number(new Date(b.date))
			);
		};

		return requestAllSortedData();
	};

	async connectedCallback() {
		if (this.savedLocations.length < 1) {
			this.innerHTML = `No locations have been chosen yet. Please choose at least one location to continue`;
			return;
		}

		let chosenLocations = "";

		for (const key in this.savedLocations) {
			const location = this.savedLocations[key];
			const name = location.split("_").join(" ");

			if (this.savedLocations.length === listLocations.length) {
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

		// const allAppointments = await this.getAllAvailableAppointments();
		const allAppointments = allStubAppointments;

		if (allAppointments.length < 1) {
			this.innerHTML = `No available appointments have been found for <strong><em>${chosenLocations}.</em></strong> Try another location or try again later.`;
			return;
		}

		const firstAppointment = allAppointments[0];

		this.innerHTML = `
    <p>The next available appointment at <strong> ${chosenLocations} </strong> for <strong>${
			this.savedPersons === 1 ? "1 person" : this.savedPersons + " persons"
		}</strong> is:</p>
    <span class="result">${firstAppointment.date}, ${
			firstAppointment.startTime
		} at ${firstAppointment.location} </span>
    `;
	}
}
