import AbstractView from "../AbstractView.js";

export default class Off2View extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Offline 1 vs 1');
	}

	async getHtml() {
		return `
		<h1>Offline 1 vs 1 page</p>
		`;
	}
}