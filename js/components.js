import { ChooseLocationsModal } from "./choose-locations-modal.js";
import { ExtendableList } from "./extendable-list.js";
import { ModalComponent } from "./modal-component.js";
import { PersonsAttentingModal } from "./persons-attending-modal.js";
import { ResultsComponent } from "./results-component.js";
import { ScrollToTop } from "./scroll-to-top.js";

customElements.define("results-component", ResultsComponent);
customElements.define("modal-component", ModalComponent);
customElements.define("choose-locations-modal", ChooseLocationsModal);
customElements.define("persons-attending-modal", PersonsAttentingModal);
customElements.define("scroll-to-top", ScrollToTop);
customElements.define("extendable-list", ExtendableList);
