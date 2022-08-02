import {
	getSavedPersonsFromLocalStorage,
	reloadResultsElement,
	savePersonsToLocalStorage,
} from "./helpers.js";

export class PersonsAttentingModal extends HTMLElement {
	constructor() {
		super();
	}

	savedPersons = getSavedPersonsFromLocalStorage();

	savePersons() {
		const input = document.getElementById("persons_attending_input");
		savePersonsToLocalStorage(input.value);
		reloadResultsElement();
	}

	changeQuantity(type) {
		const input = document.getElementById("persons_attending_input");
		const currentValue = Number(input.value);

		// IND has a max of 6 people attending per appointment
		// Minimum of 1 person attending
		if (type === "decrease") {
			currentValue > 1 ? (input.value = currentValue - 1) : null;
		} else if (type === "increase") {
			currentValue < 6 ? (input.value = currentValue + 1) : null;
		}
	}

	connectedCallback() {
		this.innerHTML = `
      <label for='persons_attending_input'>
        How many people need to attend?
      </label>
    `;

		const personsInput = document.createElement("input");
		personsInput.type = "number";
		personsInput.name = "persons_attending_input";
		personsInput.id = "persons_attending_input";
		personsInput.value = this.savedPersons;

		const decreaseBtn = document.createElement("button");
		decreaseBtn.innerHTML = '<span class="icon minus"></span>';
		decreaseBtn.onclick = () => this.changeQuantity("decrease");
		decreaseBtn.className = "btn";

		const increaseBtn = document.createElement("button");
		increaseBtn.innerHTML = '<span class="icon plus"></span>';
		increaseBtn.onclick = () => this.changeQuantity("increase");
		increaseBtn.className = "btn";

		const controlWrapper = document.createElement("span");
		controlWrapper.className = "control__wrapper";
		controlWrapper.append(decreaseBtn, personsInput, increaseBtn);

		this.appendChild(controlWrapper);

		const submitBtn = document.getElementById("submit-btn");
		submitBtn.onclick = () => {
			this.savePersons();
			this.parentElement.parentElement.remove();
		};
	}
}
