export const getSavedLocations = () =>
	window.localStorage.getItem("locations")
		? JSON.parse(window.localStorage.getItem("locations"))
		: [];

export const getSavedPersons = () =>
	window.localStorage.getItem("persons")
		? Number(JSON.parse(window.localStorage.getItem("persons")))
		: 1;
