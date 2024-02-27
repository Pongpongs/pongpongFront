const express = require('express');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const app = express();
const nodemailer = require('nodemailer');
const port = 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});

app.get('/get/security', (req, res) => {
	const code = req.query.code;
	if (code) {
		res.redirect(`http://localhost:3000?code=${code}`)
	} else {
		res.status(400).send("Code not given");
	}
});

app.get('/game/*', (req, res) => {
	res.sendFile(path.resolve("frontend", "index.html"));
});

app.post('/get/security', (req, res) => {
    const code = req.body.code;
    const postData = querystring.stringify({
        grant_type: 'authorization_code',
        client_id: 'u-s4t2ud-38e1085a57405a04552b3a4b255d1b9a1708d9a23637ac72693e9469b06a779f',
        client_secret: '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',
        code: code,
        redirect_uri: 'http://localhost:3000/get/security'
    });

    const options = {
        hostname: 'api.intra.42.fr',
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    const request = https.request(options, response => {
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        });
        response.on('end', () => {
            console.log('Token data:', data);
            res.json(JSON.parse(data));
        });
    });

    request.on('error', error => {
        console.error('Error requesting access token:', error);
        res.status(500).send('Failed to obtain access token');
    });

    request.write(postData);
    request.end();
});

app.get('/get/userinfo', (req, res) => {
    const access_token = req.headers.authorization;

    
    const getUserInfo = () => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.intra.42.fr',
                path: '/v2/me',
                method: 'GET',
                headers: {
                    'Authorization': access_token
                }
            };

            const request = https.request(options, response => {
                let data = '';
                response.on('data', chunk => {
                    data += chunk;
                });
                response.on('end', () => {
                    resolve(data); 
                });
            });

            request.on('error', error => {
                reject(error); 
            });

            request.end();
        });
    };

    
    const sendEmail = async (userEmail, verificationCode) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yoyob1223@gmail.com',
                pass: 'jhdf nkre qcrr cbkm'
            }
        });

        let mailOptions = {
            from: 'yoyob1223@gmail.com',
            to: userEmail,
            subject: 'Pongpongs 2FA Code',
            text: `Your Verification Code: ${verificationCode}`
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    
    (async () => {
        try {
            const data = await getUserInfo();
            const parsedData = JSON.parse(data); 
            const userEmail = parsedData.email;

            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            await sendEmail(userEmail, verificationCode); 
            res.json({email: userEmail, code: verificationCode});
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('An error occurred');
        }
    })();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
