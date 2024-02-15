const express = require('express');
const path = require("path");
const app = express();
const port = 3000;

// 정적 파일을 제공하는 설정
app.use(express.static(path.resolve(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});

app.get('/oauth/securitycode', (req, res) => {
	const securitycode = req.query.code;
	console.log(req.query.code);
	res.send(req.query.code);
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
