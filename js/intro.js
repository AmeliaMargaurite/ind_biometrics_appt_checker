export class Intro extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const { name, link } = this.dataset;
		this.className = "intro";
		this.innerHTML = `
      <a href="/" class="icon__wrapper">
          <span class="icon user-home large"></span>
          <p>Home</p>
        </a>
			<h1 class="title">
				IND <span class="appointment-type">${name}</span> Appointment Checker
			</h1>
			<p class="disclaimer">
				This site is a passion project, and is not associated with the IND. You
				cannot book your appointment through this site, it is simply for
				informational purposes only
			</p>
			<p class="link-to-ind">
				<a
					href="${link}"
					target="_blank"
				>
					Click here to go to the IND website for ${name.toLowerCase()}
				</a>
			</p>
		`;
	}
}
