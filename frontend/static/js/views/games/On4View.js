import AbstractView from "../AbstractView.js";

export default class On4View extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Online 1 vs 1 vs 1 vs 1');
	}

	async getHtml() {
		return `
		<h1>Online 1 vs 1 vs 1 vs 1 page</p>
		`;
	}
}