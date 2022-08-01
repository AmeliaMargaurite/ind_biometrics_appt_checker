import { getSavedLocations, getSavedPersons } from "./helpers.js";
import { listLocations } from "./locations.js";

export class ResultsComponent extends HTMLElement {
	constructor() {
		super();
	}

	savedPersons = getSavedPersons();
	savedLocations = getSavedLocations();

	// check local storage for saved preferences
	setPersons(num) {
		if (typeof num === "number") {
			this.savedPersons = num;
			window.localStorage.setItem("persons", JSON.stringify(num));
		}
	}

	getPersons = () => {
		return this.savedPersons;
	};

	setLocations = (array) => {
		this.savedLocations = array;
		window.localStorage.setItem("locations", JSON.stringify(array));
	};

	getLocations = () => {
		return this.savedLocations;
	};

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
					const url = buildURL(location.name, this.savedPersons);
					const locationName = location.name.split("_").join(" ");
					const appointments = await fetchData(url);
					appointments.forEach((appointment) => {
						allAppointments.push({
							location: locationName,
							date: new Date(appointment.date).toDateString(),
							startTime: appointment.startTime,
						});
					});
				}

			return allAppointments.sort((a, b) => Number(a.date) - Number(b.date));
		};

		return requestAllSortedData();
	};

	async connectedCallback() {
		if (this.savedLocations.length < 1) {
			this.innerHTML = `No locations have been chosen yet. Please choose at least one location to continue`;
			return;
		}

		// const allAppointments = await this.getAllAvailableAppointments();
		const tempData = [
			{
				date: new Date().toDateString(),
				startTime: "09:00",
				location: "IND Amsterdam",
			},
			{
				date: new Date().toDateString(),
				startTime: "10:00",
				location: "IND Zwolle",
			},
		];
		const firstAppointment = tempData[0];
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
