export class ModalComponent extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const type = this.getAttribute("type");

		this.innerHTML = `
    <span class="wrapper" onclick="event.stopPropagation()">
        <${type}-modal></${type}-modal>
        <span class="buttons__wrapper">
          <button class="btn secondary" id="cancel-btn">Cancel</button>
          <button class="btn primary" id="submit-btn">Submit</button>
        </span>
      </span>
    `;

		this.onclick = () => this.remove();

		const cancelBtn = document.getElementById("cancel-btn");
		cancelBtn.onclick = () => this.remove();
	}
}
