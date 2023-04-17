import {
	getSavedLocationsFromLocalStorage,
	reloadResultsElement,
	saveLocationsToLocalStorage,
} from "./helpers-01-12-22.js";
import { listLocations } from "./locations-2.js";

export class ChooseLocationsModal extends HTMLElement {
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

	savedLocations = [];
	setSavedLocations() {
		this.savedLocations = getSavedLocationsFromLocalStorage(this.api);
	}

	saveChoices() {
		// get all checked locations
		const checkedInputs = document.querySelectorAll(
			"input[type=checkbox]:not(#all_locations):checked"
		);
		const checked = [...checkedInputs].map((input) => input.name);

		// save to localStorage
		saveLocationsToLocalStorage(this.api, checked);
		// reload results section
		reloadResultsElement();
	}

	connectedCallback() {
		this.setApi(this.dataset.api);

		this.setAvailableLocations();
		this.setSavedLocations();
		this.innerHTML = `
      <legend>
        Choose the locations you wish to check
      </legend>
    `;

		const optionsSpan = document.createElement("span");
		optionsSpan.className = "options";

		// Each of the location options
		for (let key in this.availableLocations) {
			const location = this.availableLocations[key];
			const name = location.name.split("_").join(" ");

			const chosen = this.savedLocations.find(
				(savedLocation) => savedLocation === location.name
			);

			const selected = chosen ? "checked" : "";

			optionsSpan.innerHTML += `
      <label for="${location.name}__checkbox">
        <input type="checkbox" name="${location.name}" id="${location.name}__checkbox" ${selected} />
        ${name}
      </label>
      `;
		}

		// All locations checkbox
		const allSelected =
			this.savedLocations.length === this.availableLocations.length
				? "checked"
				: "";

		optionsSpan.innerHTML += `
			<label for="all_locations">
				<input type="checkbox" name="all_locations" id="all_locations" ${allSelected} />
				All locations
			</label>
		`;

		this.appendChild(optionsSpan);

		const allLocationsCheckbox = document.getElementById("all_locations");

		// RESET BUTTON

		const resetAll = () => {
			allLocationsCheckbox.checked = false;
			toggleAll(allLocationsCheckbox);
		};

		const resetDiv = document.createElement("div");
		resetDiv.className = "reset__btn";
		resetDiv.innerHTML = `<span class="icon reset"></span><p>Clear choices</p>`;
		resetDiv.addEventListener("click", resetAll);

		this.appendChild(resetDiv);

		const allLocationCheckboxes = document.querySelectorAll(
			"input[type=checkbox]:not(#all_locations)"
		);

		const toggleAll = (allLocationsCheckbox) => {
			allLocationCheckboxes.forEach((btn) => {
				btn.checked = allLocationsCheckbox.checked;
			});
		};

		allLocationsCheckbox.onchange = () => toggleAll(allLocationsCheckbox);

		for (let checkbox of allLocationCheckboxes) {
			checkbox.onchange = () => {
				const unchecked = [...allLocationCheckboxes].find(
					(box) => box.checked === false
				);
				unchecked
					? (allLocationsCheckbox.checked = false)
					: (allLocationsCheckbox.checked = true);
			};
		}

		const submitBtn = document.getElementById("submit-btn");
		submitBtn.onclick = () => {
			this.saveChoices();
			this.parentElement.parentElement.remove();
		};
	}
}
