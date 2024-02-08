### DOMContentLoaded

- 웹 페이지의 HTML이 완전히 로드되고 파싱된 시점에서 발생하는 이벤트
- JavaScript 코드를 실행하는 것이 안전하다는 신호
- 이 이벤트를 사용하려면, JavaScript에서 "DOMContentLoaded" 이벤트를 listen하고 이 이벤트가 발생할 때 실행할 함수를 등록해야 한다.
```javascript
document.addEventListener("DOMContentLoaded", function() {
  // 페이지가 로드 되었을 때 실행할 코드
});
```

### document.addEventListener
- 특정 이벤트를 감지하고, 해당 이벤트가 발생할 때마다 지정한 함수를 실행
- 첫 번째 매개변수는 감지할 이벤트의 종류를 나타내며, 두 번째 매개변수는 이벤트가 발생했을 때 실행할 함수이다.
```javascript
document.addEventListener('DOMContentLoaded', function() {
  console.log('문서가 완전히 로드되었습니다.');
});
```

### document.getElementById
- 주어진 문자열과 일치하는 ID 속성을 가진 요소를 반환
- 이 메소드를 사용하면 HTML 요소에 대한 참조를 얻을 수 있으므로, 그 요소의 속성을 변경하거나 요소와 관련된 이벤트를 처리할 수 있다.
```javascript
document.getElementById('login-button').addEventListener('click', function() {
    window.location.href = redirect_uri;
});
```
- document.getElementById('login-button') 코드는 'login-button'이라는 ID를 가진 HTML 요소를 선택하고, addEventListener('click', function() {...})은 그 요소에 클릭 이벤트 리스너를 추가하는 것

### 동적 HTML 생성
- JavaScript를 사용해서 HTML 요소를 생성하고, 이를 웹 페이지에 추가하는 것
- 이렇게 하면 웹 페이지의 내용을 사용자의 상호작용에 따라 실시간으로 변경할 수 있다.

### 이벤트 리스너
- 특정 이벤트(예: 클릭, 키보드 입력, 페이지 로드 등)가 발생했을 때 실행할 JavaScript 코드를 등록하는 것
- 이벤트 리스너는 특정 HTML 요소와 연결되며, 해당 요소에서 지정한 이벤트가 발생하면 등록된 코드가 실행된다.

### 로그인 버튼이 작동하지 않았던 이유

```javascript
// Login 뷰의 HTML을 반환
async getHtml() {
    return `
    <button id="login-button">42서울 로그인~</button>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            console.log("HTML Loaded !!!");
            const redirect_uri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-38e1085a57405a04552b3a4b255d1b9a1708d9a23637ac72693e9469b06a779f&redirect_uri=https%3A%2F%2Fwww.google.co.kr&response_type=code';
            document.getElementById('login-button').addEventListener('click', function() {
                window.location.href = redirect_uri;
            });
        });
    </script>
`;
}
```
- 여기서 document.addEventListener("DOMContentLoaded", function() {...} 부분은 웹 페이지가 완전히 로드된 후에 안에 있는 코드를 실행하라는 의미이다. 그런데 'login-button'이라는 ID를 가진 버튼은 getHtml() 함수 안에서 동적으로 생성되므로, 웹 페이지가 처음 로드될 때는 이 버튼이 존재하지 않는다. 그래서 'DOMContentLoaded' 이벤트가 발생한 시점에서는 아직 이 버튼에 접근할 수 없기에 버튼이 동작하지 않는것이다.

```js
    // Login 뷰의 HTML을 반환
async getHtml() {
    return `
        <button id="login-button">42서울 로그인</button>
        `;
}

async addEventListeners() {
    console.log("HTML Loaded !!!");
    const redirect_uri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-38e1085a57405a04552b3a4b255d1b9a1708d9a23637ac72693e9469b06a779f&redirect_uri=https%3A%2F%2Fwww.google.co.kr&response_type=code';
    document.getElementById('login-button').addEventListener('click', function() {
        window.location.href = redirect_uri;
    });
}
```
일반적으로 웹 페이지는 HTML, CSS, JavaScript 등 여러 파일로 구성되어 있습니다. 사용자의 브라우저가 웹 페이지를 보여주기 위해선 이 파일들을 모두 불러와야 합니다. 그런데 문제는 이 파일들이 모두 한 번에 로딩되지 않는다는 점입니다.

HTML 파일은 먼저 로딩되고, 그 안에 있는 JavaScript 코드는 HTML 요소들이 모두 준비된 이후에 실행됩니다. 이 때, 모든 HTML 요소들이 준비되었다는 것을 알려주는 이벤트가 'DOMContentLoaded' 이벤트입니다. 이 이벤트가 발생하면 JavaScript 코드를 실행할 수 있습니다.

하지만, 만약 JavaScript로 HTML 요소를 생성하면 어떻게 될까요? 이렇게 생성된 HTML 요소는 원래의 HTML 파일에 없었기 때문에, 'DOMContentLoaded' 이벤트가 발생할 때는 아직 준비되지 않았습니다. 따라서 이 요소에 접근하려면, 해당 요소가 생성된 이후에 접근해야 합니다.

그래서 문제가 생긴 부분은, JavaScript로 생성된 'login-button' 요소에 클릭 이벤트를 등록하려고 했지만, 'DOMContentLoaded' 이벤트가 발생했을 때는 아직 'login-button' 요소가 생성되지 않아서 접근할 수 없었습니다.

이 문제를 해결하기 위해 'login-button' 요소가 생성된 직후에 클릭 이벤트를 등록하도록 코드를 수정했습니다. 그래서 'DOMContentLoaded' 이벤트가 아닌, 'login-button' 요소가 생성된 직후에 클릭 이벤트를 등록할 수 있게 되었습니다.

그러나 여전히 문제가 있다면, 그것은 JavaScript 코드가 HTML 문자열 내에 있기 때문일 수 있습니다. 일부 브라우저는 이런 코드를 실행하지 않기 때문입니다. 이 문제를 해결하기 위해서는 JavaScript 코드를 별도의 함수로 만들고, HTML 요소가 DOM에 추가된 후에 그 함수를 호출하는 방식을 사용해야 합니다.