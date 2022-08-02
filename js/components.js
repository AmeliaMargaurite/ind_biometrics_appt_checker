import { ChooseLocationsModal } from "./choose-locations-modal.js";
import { ModalComponent } from "./modal-component.js";
import { PersonsAttentingModal } from "./persons-attending-modal.js";
import { ResultsComponent } from "./results-component.js";

customElements.define("results-component", ResultsComponent);
customElements.define("modal-component", ModalComponent);
customElements.define("choose-locations-modal", ChooseLocationsModal);
customElements.define("persons-attending-modal", PersonsAttentingModal);
