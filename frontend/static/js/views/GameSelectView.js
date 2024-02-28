import AbstractView from "./AbstractView.js";

export default class GameSelectView extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('Game Select');
		this.navigate = params.navigate;
	}

	async getHtml() {
		return `
			<h1>Select Game</h1>
			<p>
				<h2>Local Game</h2>
				<button id="go-to-local-2">1 vs 1</button>
			</p>
			<p>
				<h2>Online Game</h2>
				<p>
					<button id="go-to-online-2">1 vs 1</button>
				</p>
				<p>
					<button id="go-to-online-4">1 vs 1 vs 1 vs 1</button>
				</p>
				<p>
					<button id="go-to-online-tournament">Tournament</button>	
				</p>
			</p>
			
		`;
	}

	async addEventListeners() {
		document.getElementById('go-to-local-2').addEventListener('click', () => {
			this.navigate('/game/local/1on1');
		});
		document.getElementById('go-to-online-2').addEventListener('click', () => {
			this.navigate('/game/online/1on1');
		});
		document.getElementById('go-to-online-4').addEventListener('click', () => {
			this.navigate('/game/online/4');
		});
		document.getElementById('go-to-online-tournament').addEventListener('click', () => {
			this.navigate('/game/online/tournament');
		});
	}
}