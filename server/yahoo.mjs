import  express from 'express';
import axios from 'axios';
import { yahoo, google } from '../config/config.mjs';

const app = express();

app.use(express.json());

app.post('/insecure-send-happy-birthday-emails', async function (req, res) {
	const { username, password } = req.body;

	yahoo.log(`Grandpa isn't found.  Fetching Google contacts`);

	await axios.post(`${google.baseUrl}/insecure-get-contacts`, {
		username,
		password
	});

	res.send('Grandpa was sent an email!')
});

app.post('/secure-send-happy-birthday-emails', async function (req, res) {
	const token = req.body.token;

	try {
		yahoo.log(`Grandpa isn't found.  Fetching Google contacts`);

		await axios.post(`${google.baseUrl}/secure-get-contacts`, {
			token
		});

		res.send('Grandpa was sent an email!')
	}
	catch (error) {
		yahoo.log('Hm, I wonder what went wrong 🫤');

		res.status(500).send(`Couldn't send email to Grandpa 😞`)
	}
});

app.listen(yahoo.port, 'localhost', () => {
	yahoo.log(`Server listening on port ${yahoo.port}`);
});