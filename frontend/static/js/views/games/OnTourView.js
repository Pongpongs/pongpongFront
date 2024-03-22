import AbstractView from "../AbstractView.js";

export default class OnTourView extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Online Tournament');
	}

	async getHtml() {
		return `
		<h1>Online Tournament page</p>
		`;
	}
}