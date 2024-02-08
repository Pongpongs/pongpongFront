import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import PostView from "./views/PostView.js";
import Settings from "./views/Settings.js";
import Login from "./views/Login.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        { path: "/posts/:id", view: PostView },
        { path: "/settings", view: Settings },
        { path: "/login", view: Login }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();

    // Check if the view has addEventListeners method, if yes, call it.
    if (view.addEventListeners && typeof view.addEventListeners === 'function') {
        view.addEventListeners();
    }

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});

// // 로그인 상태 확인 함수
// function checkLoginStatus(inOrOut) {
//     // 로그인 상태 확인 로직을 작성합니다.
//     // 예를 들어, 서버에 요청을 보내 로그인 상태를 확인하거나
//     // 브라우저의 로컬 스토리지나 쿠키에 저장된 토큰을 확인할 수 있습니다.
//     // 이 예시에서는 임의로 true를 반환하도록 합니다.
//     return inOrOut !== 'Logout';
//
// }
//
// // 네비게이션 바 업데이트 함수
// function updateNavbar() {
//     const loginTab = document.querySelector('.nav__link[data-link="login"]');
//     const loginStatus = checkLoginStatus(loginTab.textContent);
//
//     if (loginStatus) {
//         loginTab.textContent = 'Logout';
//         loginTab.href = '/logout';
//     } else {
//         loginTab.textContent = 'Login';
//         loginTab.href = '/login';
//     }
// }
//
// // 페이지 로드 시 네비게이션 바 업데이트
// window.onload = updateNavbar;
//
// // 로그아웃 요청 함수
// async function logout() {
//     // 서버에 로그아웃 요청을 보내고 응답을 받습니다.
//     // 이 예시에서는 임의로 Promise를 반환하도록 합니다.
//     return new Promise((resolve, reject) => {
//         // 로그아웃 요청이 성공하면 resolve를 호출합니다.
//         resolve(true);
//     });
// }
//
// // 로그아웃 탭 클릭 이벤트 핸들러
// function onLogoutTabClick(event) {
//     event.preventDefault();
//     updateNavbar();
// }
//
//
// // 로그아웃 탭 클릭 이벤트 등록
// document.querySelector('.nav__link[data-link="login"]').addEventListener('click', onLogoutTabClick);
