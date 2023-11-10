import * as fs from 'fs';
import  express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cors from 'cors';
import { drivetrak, google, spa } from '../config/config.mjs';

// This is your secret/siging key.  THIS CANNOT LEAK
const SIGNING_KEY = fs.readFileSync('./private-key.pem').toString();
const PUBLIC_KEY = fs.readFileSync('./public-key.pem').toString();
const databaseOfM2mClients = {
	'basic-client-id': {
		clientSecret: 'bazinga',
		audiences: {
			'https://google.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-contacts',
					'read-email-address',
					'read-emails'
				]
			}
		}
	},
	'privileged-client-id': {
		clientSecret: 'oohhaa',
		audiences: {
			'https://google.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-contacts',
					'read-email-address',
					'read-emails',
					'delete-account'
				]
			}
		}
	},
	'multi-app-client-id': {
		clientSecret: 'i-have-the-power',
		audiences: {
			'https://facebook.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-friends'
				]
			},
			'https://yahoo.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'send-email'
				]
			},
			'https://google.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-emails'
				]
			},
			'https://drivetrak.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-students'
				]
			}
		}
	}
};

const databaseOfSpaClients = {
	'basic-single-page-app': {
		audiences: {
			'https://google.com/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-contacts',
					'read-email-address',
					'read-emails'
				]
			}
		},
		redirectUris: [
			...spa.redirectUris
		]
	},
	'drivetrak': {
		audiences: {
			'https://api.drivetrak.io/': {
				timeToLiveInSeconds: 86400, // 24 hours in seconds
				permissions: [
					'read-students'
				]
			}
		},
		redirectUris: [
			...drivetrak.redirectUris
		]
	}
};

const users = {
	'fearny': {
		password: 'my-super-secret-password'
	}
};

const authCodes = {};

const app = express();

app.use(express.json());
app.use(cors());

app.post('/insecure-delete-account', function (req, res) {
	if (req.body.username !== 'fearny' || req.body.password !== 'my-super-secret-password') return res.status(401).send("Invalid username or password");

	google.log(`I'm about to end this man's whole account 💥`);

	res.send('Account deleted');
});

app.post('/secure-delete-account', function (req, res) {
	try {
		const token = jwt.verify(req.body.token, PUBLIC_KEY, { algorithm: 'ES256' });

		if (!/delete-account/.test(token.permissions)) throw 'invalid permissions';

		google.log(`I'm about to end this man's whole account 💥`);

		res.send('Account deleted');
	}
	catch (error) {
		google.log(`Denied permission to delete account`);

		res.status(401).send(`Gnar, you don't have permission to do that`);
	}
});

app.post('/insecure-get-contacts', function (req, res) {
	if (req.body.username !== 'fearny' || req.body.password !== 'my-super-secret-password') return res.status(401).send("Invalid username or password");

	google.log(`Returning Google contacts`);

	res.send(['grandpa123@google.com']);
});

app.post('/secure-get-contacts', function (req, res) {
	try {
		const token = jwt.verify(req.body.token, PUBLIC_KEY, { algorithm: 'ES256' });

		if (!/read-contacts/.test(token.permissions)) throw 'invalid permissions';

		google.log(`Returning Google contacts`);

		res.send(['grandpa123@google.com']);
	}
	catch (error) {
		google.log(`Denied permission to get contacts`);

		res.status(401).send(`Gnar, you don't have permission to do that`);
	}
});

app.post('/oauth/token', function (req, res) {
	const { grant_type } = req.body;

	if (grant_type === 'client_credentials') {
		return handleClientCredentials(req.body, grant_type, res);
	}
	else if (grant_type === 'insecure_authorization_code') {
		return handleAuthorizationCode(req.body, grant_type, res);
	}
	else if (grant_type === 'authorization_code') {
		return handleAuthorizationCodeWithPkce(req.body, grant_type, res);
	}

	return res.status(400).send(`Unknown grant type "${grant_type}"`);
});

app.get('/implicit-auth', function (req, res) {
	return res.status(200).contentType('html').send(fs.readFileSync('./server/implicit-login.html'));
});

app.get('/authorization-code-auth', function (req, res) {
	return res.status(200).contentType('html').send(fs.readFileSync('./server/authorization-code-login.html'));
});

app.get('/authorization-code-with-pkce-auth', function (req, res) {
	return res.status(200).contentType('html').send(fs.readFileSync('./server/authorization-code-with-pkce-login.html'));
});

app.post('/implicit-login', function (req, res) {
	const { username = '', password = '', client_id = '', audience = '', redirect_uri = '' } = req.body || {};
	const user = users[username] || {};

	if (user.password === password) {
		const client = databaseOfSpaClients[client_id];

		if (!client) return res.status(401).send('Invalid clientId');

		const { permissions, timeToLiveInSeconds } = client.audiences[audience] || {};

		if (!permissions) return res.status(401).send(`This client does not have permission to communicate with "${audience}"`);

		return res.status(200).json({
			redirect_uri: `${redirect_uri}?token=${generateToken(client_id, audience, timeToLiveInSeconds, permissions, 'code')}`
		});
	}

	return res.status(401).send(`Username or password incorrect`);
});

app.post('/authorization-code-login', function (req, res) {
	const { username = '', password = '', client_id = '', audience = '', redirect_uri = '' } = req.body || {};
	const user = users[username] || {};

	if (user.password === password) {
		const client = databaseOfSpaClients[client_id];

		if (!client) return res.status(401).send('Invalid clientId');

		const { permissions, timeToLiveInSeconds } = client.audiences[audience] || {};

		if (!permissions) return res.status(401).send(`This client does not have permission to communicate with "${audience}"`);

		const code = generateAuthCode();

		console.log(code);

		authCodes[code] = {
			client_id,
			audience,
			timeToLiveInSeconds,
			permissions
		};

		return res.status(200).json({
			redirect_uri: `${redirect_uri}?code=${code}`
		});
	}

	return res.status(401).send(`Username or password incorrect`);
});

app.post('/authorization-code-with-pkce-login', function (req, res) {
	const { username = '', password = '', client_id = '', audience = '', redirect_uri = '', code_challenge = '' } = req.body || {};
	const user = users[username] || {};

	if (user.password === password) {
		const client = databaseOfSpaClients[client_id];

		if (!client) return res.status(401).send('Invalid clientId');

		const { permissions, timeToLiveInSeconds } = client.audiences[audience] || {};
		const { redirectUris = [] } = client;

		if (!permissions) return res.status(401).send(`This client does not have permission to communicate with "${audience}"`);
		if (!redirectUris.find(uri => redirect_uri === uri)) return res.status(401).send(`Cannot redirect to "${redirect_uri}"`);

		const code = generateAuthCode();

		authCodes[code] = {
			client_id,
			audience,
			timeToLiveInSeconds,
			permissions,
			code_challenge
		};

		return res.status(200).json({
			redirect_uri: `${redirect_uri}?code=${code}`
		});
	}

	return res.status(401).send(`Username or password incorrect`);
});

app.get('/.well-known/jwks.json', function (req, res) {
	return res.status(200).send({
		publicKey: PUBLIC_KEY
	})
});

app.listen(google.port, 'localhost', () => {
	google.log(`Server listening on port ${google.port}`);
});

function handleClientCredentials(args, grant_type, res) {
	const { client_id, audience, client_secret } = args;

	if (!client_id || !client_secret) return res.status(401).send('Invalid clientId or clientSecret');

	const client = databaseOfM2mClients[client_id] || {};

	if (client.clientSecret !== client_secret) return res.status(401).send('Invalid clientId or clientSecret');

	const { permissions, timeToLiveInSeconds } = client.audiences[audience] || {};

	if (!permissions) return res.status(401).send(`This client does not have permission to communicate with "${audience}"`);

	return res.status(200).send({
		access_token: generateToken(client_id, audience, timeToLiveInSeconds, permissions, grant_type),
		permissions: permissions.join(' '),
		"expires_in": timeToLiveInSeconds,
		"token_type": "Bearer"
	});
}

function handleAuthorizationCode(args, grant_type, res) {
	const { code } = args;
	const codeDetails = authCodes[code];

	if (!codeDetails) return res.status(401).send(`That authorization code is invalid`);

	delete authCodes[code];

	const { client_id, audience, timeToLiveInSeconds, permissions } = codeDetails;

	return res.status(200).send({
		access_token: generateToken(client_id, audience, timeToLiveInSeconds, permissions, grant_type),
		permissions: permissions.join(' '),
		"expires_in": timeToLiveInSeconds,
		"token_type": "Bearer"
	});
}

function handleAuthorizationCodeWithPkce(args, grant_type, res) {
	const { code, code_verifier } = args;
	const codeDetails = authCodes[code] || {};

	if (codeDetails.code_challenge !== base64urlencode(hash(code_verifier))) return res.status(401).send(`That authorization code is invalid`);

	delete authCodes[code];

	const { client_id, audience, timeToLiveInSeconds, permissions } = codeDetails;

	return res.status(200).send({
		access_token: generateToken(client_id, audience, timeToLiveInSeconds, permissions, grant_type),
		permissions: permissions.join(' '),
		"expires_in": timeToLiveInSeconds,
		"token_type": "Bearer"
	});
}

function generateToken(clientId, audience, timeToLiveInSeconds, permissions, grant_type) {
	const now = Math.trunc(Date.now() / 1000);
	const tokenPayload = {
		issuer: google.baseUrl,
		subject: clientId,
		audience: audience,
		issuedAt: now,
		expires: now + timeToLiveInSeconds,
		permissions: permissions.join(' '),
		grantType: grant_type
	};

	return jwt.sign(tokenPayload, SIGNING_KEY, { algorithm: 'ES256' });
}

function hash(target) {
	return crypto.createHash('SHA256').update(target).digest();
}

function generateAuthCode() {
	return crypto.randomBytes(48).toString('hex');
}

function base64urlencode(a) {
	let str = "";
	let bytes = new Uint8Array(a);
	let len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return btoa(str)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}