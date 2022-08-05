import {
	getSavedPersonsFromLocalStorage,
	reloadResultsElement,
	savePersonsToLocalStorage,
} from "./helpers.js";

export class PersonsAttentingModal extends HTMLElement {
	constructor() {
		super();
	}

	maxPeople = 6;
	minPeople = 1;

	api = null;
	setApi(api) {
		this.api = api;
	}

	savedPersons = null;
	setSavedPersons() {
		this.savedPersons = getSavedPersonsFromLocalStorage(this.api);
	}

	savePersons() {
		const input = document.getElementById("persons-attending_input");
		if (input.value >= this.minPeople && input.value <= this.maxPeople) {
			savePersonsToLocalStorage(this.api, input.value);
			reloadResultsElement();
			return true;
		} else {
			const errorMsg = document.getElementById("persons-attending__error-msg");
			errorMsg.innerHTML = `Please choose a number between ${this.minPeople} and ${this.maxPeople} people.`;
			errorMsg.classList.remove("hidden");
		}
	}

	changeQuantity(type) {
		const input = document.getElementById("persons-attending_input");
		const currentValue = Number(input.value);

		// IND has a max of 6 people attending per appointment
		// Minimum of 1 person attending
		if (type === "decrease") {
			currentValue > this.minPeople ? (input.value = currentValue - 1) : null;
		} else if (type === "increase") {
			currentValue < this.maxPeople ? (input.value = currentValue + 1) : null;
		}
	}

	connectedCallback() {
		this.setApi(this.dataset.api);
		this.setSavedPersons();
		this.innerHTML = `
      <label for='persons-attending_input'>
        How many people need to attend?
      </label>
    `;

		const personsInput = document.createElement("input");
		personsInput.type = "number";
		personsInput.name = "persons-attending_input";
		personsInput.id = "persons-attending_input";
		personsInput.value = this.savedPersons;

		const decreaseBtn = document.createElement("button");
		decreaseBtn.innerHTML = '<span class="icon minus"></span>';
		decreaseBtn.onclick = () => this.changeQuantity("decrease");
		decreaseBtn.className = "btn";

		const increaseBtn = document.createElement("button");
		increaseBtn.innerHTML = '<span class="icon plus"></span>';
		increaseBtn.onclick = () => this.changeQuantity("increase");
		increaseBtn.className = "btn";

		const errorMsg = document.createElement("p");
		errorMsg.className = "error hidden";
		errorMsg.id = "persons-attending__error-msg";

		const controlWrapper = document.createElement("span");
		controlWrapper.className = "control__wrapper";
		controlWrapper.append(decreaseBtn, personsInput, increaseBtn);

		this.appendChild(controlWrapper);
		this.appendChild(errorMsg);
		const submitBtn = document.getElementById("submit-btn");
		submitBtn.onclick = () => {
			if (this.savePersons()) {
				this.parentElement.parentElement.remove();
				// to stop default submit behaviour
			} else return false;
		};
	}
}
