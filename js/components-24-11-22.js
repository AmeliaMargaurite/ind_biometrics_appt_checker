import { ChooseLocationsModal } from "./choose-locations-modal-24-11-22.js";
import { Intro } from "./intro.js";
import { ModalComponent } from "./modal-component.js";
import { PersonsAttentingModal } from "./persons-attending-modal.js";
import { ResultsComponent } from "./results-component-24-11-22.js";
import { ScrollToTop } from "./scroll-to-top.js";

customElements.define("results-component", ResultsComponent);
customElements.define("modal-component", ModalComponent);
customElements.define("choose-locations-modal", ChooseLocationsModal);
customElements.define("persons-attending-modal", PersonsAttentingModal);
customElements.define("scroll-to-top", ScrollToTop);
customElements.define("introduction-el", Intro, { extends: "section" });
