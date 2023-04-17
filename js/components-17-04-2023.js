import { ChooseLocationsModal } from "./choose-locations-modal-17-04-2023.js";
import { Intro } from "./intro.js";
import { ModalComponent } from "./modal-component.js";
import { PersonsAttentingModal } from "./persons-attending-modal-01-12-22.js";
import { ResultsComponent } from "./results-component-17-04-2023.js";
import { ScrollToTop } from "./scroll-to-top-01-12-22.js";

customElements.define("results-component", ResultsComponent);
customElements.define("modal-component", ModalComponent);
customElements.define("choose-locations-modal", ChooseLocationsModal);
customElements.define("persons-attending-modal", PersonsAttentingModal);
customElements.define("scroll-to-top", ScrollToTop, { extends: "a" });
customElements.define("introduction-el", Intro, { extends: "section" });
