import  express from 'express';
import axios from 'axios';
import fs from 'fs';
import { drivetrak, google } from '../config/config.mjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/', function (req, res) {
	drivetrak.log('Serving content base page');

	return res.status(200).contentType('html').send(fs.readFileSync('./spa/drivetrak.html'));
});

app.get('/finish-auth', function (req, res) {
	drivetrak.log('Finishing auth');

	return res.status(200).contentType('html').send(fs.readFileSync('./spa/drivetrak.html'));
});

app.post('/get-students', async function (req, res) {
	try {
		const { data: { publicKey }} = await axios.get(`${google.baseUrl}/.well-known/jwks.json`);
		const token = jwt.verify(req.body.token, publicKey, { algorithm: 'ES256' });

		if (!/read-students/.test(token.permissions)) throw 'invalid permissions';

		console.log(token);

		res.send(['johndoe@yahoo.com', 'janedoe@hotmail.com']);
	}
	catch (error) {
		console.log(error.message);
		res.status(401).send(`You don't have permission to do get the students`);
	}
});

app.listen(drivetrak.port, 'localhost', () => {
	drivetrak.log(`Server listening on port ${drivetrak.port}`);
});