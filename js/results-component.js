import { listLocations } from "./locations.js";

class ResultsComponent extends HTMLElement {
	constructor() {
		super();
	}

	persons = window.localStorage.getItem("persons")
		? Number(JSON.parse(window.localStorage.getItem("persons")))
		: 1;

	locations = window.localStorage.getItem("locations")
		? JSON.parse(window.localStorage.getItem("locations"))
		: listLocations;
	// check local storage for saved preferences
	setPersons(num) {
		if (typeof num === "number") {
			this.Persons = num;
			window.localStorage.setItem("persons", JSON.stringify(num));
		}
	}

	getPersons = () => {
		return this.Persons;
	};

	setLocations = (array) => {
		this.locations = array;
		window.localStorage.setItem("locations", JSON.stringify(array));
	};

	getLocations = () => {
		return this.locations;
	};

	getAllAvailableAppointments = async () => {
		const persons = this.Persons;
		const locations = this.locations;

		const buildURL = (locationKey, persons) => {
			return `https://oap.ind.nl/oap/api/desks/${locationKey}/slots/?productKey=BIO&persons=${persons}`;
		};

		const fetchData = async (url) => {
			let body = "{";
			const response = await fetch(url, {
				method: "GET",
				// headers: {
				// 	"Content-Type": "application/json",
				// },
			}).then((resp) => resp.text());
			// response is malformed, need to remake
			const parts = response.split(')]}\',\n{"status":"OK",');
			return JSON.parse((body += parts[1])).data;
		};

		const requestAllSortedData = async () => {
			const allAppointments = [];

			for (let location of locations) {
				const url = buildURL(location.key, this.persons);
				const locationName = location.key.split("_").join(" ");
				const appointments = await fetchData(url);
				appointments.forEach((appointment) => {
					allData.push({
						location: locationName,
						date: new Date(appointment.date),
						startTime: appointment.startTime,
					});
				});
			}

			return allAppointments.sort((a, b) => Number(a.date) - Number(b.date));
		};

		return requestAllSortedData();
	};

	async connectedCallback() {
		console.log(this.persons);
		const allAppointments = await this.getAllAvailableAppointments();
		console.log(allAppointments);
	}
}

customElements.define("results-component", ResultsComponent);
