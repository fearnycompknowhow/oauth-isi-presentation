import * as fs from 'fs';
import express from 'express';
import cors from 'cors';
import { spa } from '../config/config.mjs';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
	spa.log('Serving content base page');

	return res.status(200).contentType('html').send(fs.readFileSync('./spa/spa.html'));
});

app.get('/finish-implicit-flow', function (req, res) {
	spa.log('Finishing auth flow');

	return res.status(200).contentType('html').send(fs.readFileSync('./spa/spa.html'));
});

app.get('/finish-authorization-code-flow', function (req, res) {
	spa.log('Finishing auth flow');

	return res.status(200).contentType('html').send(fs.readFileSync('./spa/spa.html'));
});

app.get('/finish-authorization-code-with-pkce-flow', function (req, res) {
	spa.log('Finishing auth flow');

	return res.status(200).contentType('html').send(fs.readFileSync('./spa/spa.html'));
});

app.listen(spa.port, 'localhost', () => {
	spa.log(`Server listening on port ${spa.port}`);
});