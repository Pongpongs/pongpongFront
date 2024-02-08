import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
    }

    // Login 뷰의 HTML을 반환
    async getHtml() {
        return `
            <button id="login-button">42서울 로그인</button>
        `;
    }

    async addEventListeners() {
        console.log("HTML Loaded !!!");
        const redirect_uri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-38e1085a57405a04552b3a4b255d1b9a1708d9a23637ac72693e9469b06a779f&redirect_uri=https%3A%2F%2Fwww.google.com&response_type=code';
        document.getElementById('login-button').addEventListener('click', function() {
            window.location.href = redirect_uri;
        });

        // 토큰을 추출하는 로직
        const token = this.getQueryParam('token');
        if (token) {
            // 사용자가 로그인 후 토큰을 받아온 경우 처리할 코드를 여기에 추가하세요.
            console.log("Received token:", token);
            // 예: 토큰을 로컬 스토리지에 저장하거나, 백엔드로 전송하는 등의 작업을 수행할 수 있습니다.
        }
    }

    // URL에서 쿼리 파라미터를 가져오는 메소드
    getQueryParam(name) {
        let params = new URLSearchParams(window.location.search);
        console.log("param name:", name);
        return params.get(name);
    }
}
