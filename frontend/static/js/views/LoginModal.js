export default class LoginModal {
    static displayLoginModal() {
        console.log("what???");
        const token = localStorage.getItem('token');

        // 토큰이 없거나 만료된 경우 모달을 표시
        if (!token || this.isTokenExpired(token)) {
            const modal = `
                <div id="login-modal" class="modal">
                    <div class="modal-content">
                        <button id="loginBtn">42서울 로그인</button>
                    </div>
                </div>
            `;
            document.body.innerHTML += modal;

            const modalElement = document.getElementById('login-modal');
            modalElement.style.display = 'block';

            document.getElementById('loginBtn').addEventListener('click', () => {
                this.redirectToLogin();
            });
        }
    }

    static closeModal() {
        const modal = document.getElementById('login-modal');
        modal.style.display = 'none';
    }

    static redirectToLogin() {
        const redirectUri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-38e1085a57405a04552b3a4b255d1b9a1708d9a23637ac72693e9469b06a779f&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fsecuritycode&response_type=code';
        window.location.href = redirectUri;
    }

    static isTokenExpired(token) {
        // 토큰 만료 여부를 확인하는 로직을 구현하세요.
        // 예: 토큰의 만료 시간과 현재 시간을 비교하여 만료되었는지 확인합니다.
        // 토큰이 만료되었다면 true를 반환하고, 그렇지 않다면 false를 반환합니다.
        // 필요에 따라 백엔드 API를 호출하여 토큰의 유효성을 검증할 수도 있습니다.
        return true;
    }
}
