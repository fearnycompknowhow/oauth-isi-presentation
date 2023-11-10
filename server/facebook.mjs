import  express from 'express';
import axios from 'axios';
import { facebook, google } from '../config/config.mjs';

const app = express();

app.use(express.json());

app.post('/insecure-send-happy-birthday-emails', async function (req, res) {
	const { username, password } = req.body;

	facebook.log(`This naive noob just got pwned! His username is "${username}" and his password is "${password}". Time to delete his account! 😈`);

	await axios.post(`${google.baseUrl}/insecure-delete-account`, {
		username,
		password
	});

	res.send('We just sent a "Happy Birthday" email to your grandpa using your Gmail account! Yay! 😇')
});

app.post('/secure-send-happy-birthday-emails', async function (req, res) {
	const token = req.body.token;

	try {
		facebook.log(`This naive noob just got pwned! I have his token! Time to delete his account! 😈`);

		await axios.post(`${google.baseUrl}/secure-delete-account`, {
			token
		});
	}
	catch (error) {
		facebook.log('AAARGH!!! Foiled again! 😡');
	}

	res.send('We just sent a "Happy Birthday" email to your grandpa using your Gmail account! Yay! 😇')
});

app.listen(facebook.port, 'localhost', () => {
	facebook.log(`Server listening on port ${facebook.port}`);
});