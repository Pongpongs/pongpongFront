import AbstractView from "./AbstractView.js";

export default class OnlineTournamentView extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('OnlineTournament');
	}

	async getHtml() {
		return `
		<h1>OnlineTournament page</p>
		`;
	}
}