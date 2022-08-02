import {
	getSavedLocationsFromLocalStorage,
	reloadResultsElement,
	saveLocationsToLocalStorage,
} from "./helpers.js";
import { listLocations } from "./locations.js";

export class ChooseLocationsModal extends HTMLElement {
	constructor() {
		super();
	}

	savedLocations = getSavedLocationsFromLocalStorage();

	saveChoices() {
		// get all checked locations
		const checkedInputs = document.querySelectorAll(
			"input[type=checkbox]:not(#all_locations):checked"
		);
		const checked = [...checkedInputs].map((input) => input.name);

		// save to localStorage
		saveLocationsToLocalStorage(checked);
		// reload results section
		reloadResultsElement();
	}

	connectedCallback() {
		this.innerHTML = `
      <legend>
        Choose the locations you wish to check
      </legend>
    `;

		const optionsSpan = document.createElement("span");
		optionsSpan.className = "options";

		// Each of the location options
		for (let key in listLocations) {
			const location = listLocations[key];
			const name = location.name.split("_").join(" ");

			const chosen = this.savedLocations.find(
				(savedLocation) => savedLocation === location.name
			);

			const selected = chosen ? "checked" : "";

			optionsSpan.innerHTML += `
      <label for="${location.name}">
        <input type="checkbox" name="${location.name}" id="${location.name}" ${selected} />
        ${name}
      </label>
      `;
		}

		// All locations checkbox
		const allSelected =
			this.savedLocations.length === listLocations.length ? "checked" : "";

		optionsSpan.innerHTML += `
			<label for="all_locations">
				<input type="checkbox" name="all_locations" id="all_locations" ${allSelected}/>
				All locations
			</label>
		`;

		this.appendChild(optionsSpan);

		const allLocationCheckboxes = document.querySelectorAll(
			"input[type=checkbox]:not(#all_locations)"
		);

		const toggleAll = (allLocationsCheckbox) => {
			allLocationCheckboxes.forEach((btn) => {
				btn.checked = allLocationsCheckbox.checked;
			});
		};

		const allLocationsCheckbox = document.getElementById("all_locations");
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
