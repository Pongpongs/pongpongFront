import AbstractView from "./AbstractView.js";

export default class GameSelectView extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Game Select');
        this.navigate = params.navigate;
    }

    async getHtml() {
        return `
			<h1>Game Mode</h1>
            <div class="onoff-group" role="group" aria-label="OnOff button group">
                <input type="radio" class="btn-check" name="onlineOffline" id="offline-button" autocomplete="off" checked>
                <label class="btn btn-outline-primary" for="offline-button">Offline</label>

                <input type="radio" class="btn-check" name="onlineOffline" id="online-button" autocomplete="off">
                <label class="btn btn-outline-primary" for="online-button">Online</label>
            </div>
            <div class="game-mode-group" role="group" aria-label="Players toggle button group">
                <input type="radio" class="btn-check" name="gameMode" id="2p-button" autocomplete="off" checked>
                <label class="btn btn-outline-primary" for="2p-button">1 vs 1</label>

                <input type="radio" class="btn-check" name="gameMode" id="4p-button" autocomplete="off">
                <label class="btn btn-outline-primary" for="4p-button">1 vs 1 vs 1 vs 1</label>

                <input type="radio" class="btn-check" name="gameMode" id="Tour-button" autocomplete="off">
                <label class="btn btn-outline-primary" for="Tour-button">Tournament</label>
            </div>
            <div id="nicknameInputs"></div>
            <div class="form-group" id="roomNameGroup">
                <label for="roomName">Room Name</label>
                <input type="text" class="form-control" id="roomName" placeholder="Enter Room Name">
            </div>
            <button id="confirmButton" class="btn btn-primary" disabled>Confirm</button>
        `;
    }

    async addEventListeners() {
        const onlineOffline = document.getElementsByName('onlineOffline');
        const gameMode = document.getElementsByName('gameMode');
        const nicknameInputs = document.getElementById('nicknameInputs');
        const roomNameGroup = document.getElementById('roomNameGroup');
        const confirmButton = document.getElementById('confirmButton');
		const roomNameInput = document.getElementById('roomName');

        const updateInputs = () => {
            const isOffline = document.getElementById('offline-button').checked;
            const gameModeSelected = document.querySelector('input[name="gameMode"]:checked').id;
            let inputHtml = '';

            if (isOffline) {
                if (gameModeSelected === '2p-button') {
                    inputHtml += `<input type="text" class="form-control mb-2" placeholder="Nickname for Player 1">
                                  <input type="text" class="form-control mb-2" placeholder="Nickname for Player 2">`;
                } else {
                    inputHtml += `<input type="text" class="form-control mb-2" placeholder="Nickname for Player 1">
                                  <input type="text" class="form-control mb-2" placeholder="Nickname for Player 2">
                                  <input type="text" class="form-control mb-2" placeholder="Nickname for Player 3">
                                  <input type="text" class="form-control mb-2" placeholder="Nickname for Player 4">`;
                }
            } else {
                inputHtml = `<input type="text" class="form-control mb-2" placeholder="Your Nickname">`;
            }

            nicknameInputs.innerHTML = inputHtml;
            checkInputs();
        };

		confirmButton.addEventListener('click', () => {
			const onlineOfflineValue = document.querySelector('input[name="onlineOffline"]:checked').id;
			const gameModeValue = document.querySelector('input[name="gameMode"]:checked').id;
			const roomNameValue = roomNameInput.value;
	
			console.log(`Online/Offline: ${onlineOfflineValue}, Game Mode: ${gameModeValue}, Room Name: ${roomNameValue}`);
	
			// 여기에 서버로 데이터를 보내는 등의 추가 작업을 수행할 수 있습니다.
		});


        const checkInputs = () => {
            const inputs = nicknameInputs.querySelectorAll('input');
            const roomName = document.getElementById('roomName').value.trim();
            const allFilled = Array.from(inputs).every(input => input.value.trim() !== '') && roomName !== '';

            confirmButton.disabled = !allFilled;
        };

        onlineOffline.forEach(button => button.addEventListener('change', updateInputs));
        gameMode.forEach(button => button.addEventListener('change', updateInputs));

        document.addEventListener('input', checkInputs);
        updateInputs();
    }
}
