export const getSavedLocationsFromLocalStorage = () =>
	window.localStorage.getItem("locations")
		? JSON.parse(window.localStorage.getItem("locations"))
		: [];

export const getSavedPersonsFromLocalStorage = () =>
	window.localStorage.getItem("persons")
		? Number(JSON.parse(window.localStorage.getItem("persons")))
		: 1;

export const saveLocationsToLocalStorage = (array) => {
	window.localStorage.setItem("locations", JSON.stringify(array));
};

export const savePersonsToLocalStorage = (num) => {
	window.localStorage.setItem("persons", num);
};

export const reloadResultsElement = () => {
	const oldResults = document.getElementsByTagName("results-component")[0];
	const newResults = document.createElement("results-component");
	oldResults.replaceWith(newResults);
};
