import AbstractView from "./AbstractView.js";

export default class Local1on1View extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Local 1 vs 1');
	}

	async getHtml() {
		return `
		<h1>Local 1 vs 1 page</p>
		`;
	}
}