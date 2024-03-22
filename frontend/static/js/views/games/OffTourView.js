import AbstractView from "../AbstractView.js";

export default class OffTourView extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Offline Tournament');
	}

	async getHtml() {
		return `
		<h1>Offline Tournament page</p>
		`;
	}
}