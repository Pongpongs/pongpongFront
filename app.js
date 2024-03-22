const express = require('express');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const app = express();
const nodemailer = require('nodemailer');
const port = 3000;
const fs = require('fs');
const fetch = require('node-fetch');


const privateKeyPath = '/etc/letsencrypt/live/pongpongs.duckdns.org/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/pongpongs.duckdns.org/fullchain.pem';


const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');


const agent = new https.Agent({
    key: privateKey,
    cert: certificate,
    rejectUnauthorized: false
});

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});

app.get('/game/*', (req, res) => {
	res.sendFile(path.resolve("frontend", "index.html"));
});

app.post('/backend/send', async (req, res) => {
    const realBackendURL = 'https://43.200.228.128/realback/send';
    const { userEmail, access_token } = req.body;

    try {
        const response = await fetch(realBackendURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                userEmail: userEmail,
                access_token: access_token
            }),
			agent: agent
        });
		
        if (response.status == 200 || response.status == 201) {
            res.status(200).send();
        } else {
            throw new Error('Failed to forward request to real backend server.');
        }	
    } catch (error) {
        console.error('Error forwarding request:', error);
        res.status(500).send('Error forwarding request to real backend server.');
    }
});

app.get('/get/security', (req, res) => {
    const code = req.query.code;
    if (code) {
        res.redirect(`https://pongpongs.duckdns.org/?code=${code}`);
    } else {
        res.status(400).send("Code not given");
    }
});

app.post('/get/security', (req, res) => {
    const code = req.body.code;

	console.log("code = ", code);
    const postData = querystring.stringify({
        grant_type: 'authorization_code',
        client_id: 'u-s4t2ud-38e1085a57405a04552b3a4b255d1b9a1708d9a23637ac72693e9469b06a779f',
        client_secret: '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',
        code: code,
        redirect_uri: 'https://pongpongs.duckdns.org/get/security'
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
            res.json(JSON.parse(data));
			console.log("request === ", JSON.parse(data));
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
    console.log(`Server running at https://pongpongs.duckdns.org`);
});
