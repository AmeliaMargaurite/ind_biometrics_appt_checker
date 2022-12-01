// GETTERS
export const getAPIItems = (api) =>
	window.localStorage.getItem(api)
		? JSON.parse(window.localStorage.getItem(api))
		: [];

export const getSavedLocationsFromLocalStorage = (api) => {
	const items = getAPIItems(api);
	if (items?.locations?.length > 0) {
		return items.locations;
	}
	return [];
};

export const getSavedPersonsFromLocalStorage = (api) => {
	const items = getAPIItems(api);
	if (items?.persons > 0) {
		return Number(items.persons);
	}
	return 1;
};

// SETTERS
export const saveLocationsToLocalStorage = (api, array) => {
	const items = getAPIItems(api);

	window.localStorage.setItem(
		api,
		JSON.stringify({ ...items, locations: array })
	);
};

export const savePersonsToLocalStorage = (api, num) => {
	const items = getAPIItems(api);
	window.localStorage.setItem(api, JSON.stringify({ ...items, persons: num }));
};

// UI
export const reloadResultsElement = () => {
	const oldResults = document.getElementsByTagName("results-component")[0];
	const newResults = document.createElement("results-component");
	newResults.dataset.api = oldResults.dataset.api;
	newResults.setAttribute("loading", true);
	oldResults.replaceWith(newResults);
};

export const getBooleanFromString = (string) => {
	if (string == "true") return true;
	if (string == "false") return false;
	return undefined;
};

export const throttleFunction = (callBack, delay = 1000) => {
	let wait = false;
	let waitingArgs = null;

	const timeoutFunction = () => {
		if (waitingArgs === null) {
			wait = false;
		} else {
			callBack(...waitingArgs);
			waitingArgs = null;
			setTimeout(timeoutFunction, delay);
		}
	};

	return (...args) => {
		if (wait) {
			waitingArgs = args;
			return;
		}

		callBack(...args);
		wait = true;

		setTimeout(timeoutFunction, delay);
	};
};
