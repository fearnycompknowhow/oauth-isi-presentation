import axios from 'axios';
import { facebook, yahoo } from '../config/config.mjs';

const username = 'fearny';
const password = 'my-super-secret-password';

console.logOnNewLine('😴...');

await sleep(3000);

console.logOnNewLine('🥱...');

await sleep(3000);

console.logOnNewLine('☕ 👀');

await sleep(3000);

console.logOnNewLine(`"Alright, let's see who has a birthday today 🔍..."`);

await sleep(4000);

console.logOnNewLine(`🔍...`);

await sleep(1000);

console.logOnNewLine(`🔍...`);

await sleep(1000);

console.logOnNewLine(`🔍...`);

await sleep(1000);

console.logOnNewLine(`Ah, grandpa has a birthday!  Sending out "Happy Birthday" messages!`);

await sleep(4000);

const { data: yahooResponse } = await axios.post(`${yahoo.baseUrl}/insecure-send-happy-birthday-emails`, {
	username,
	password
});
const { data: facebookResponse } = await axios.post(`${facebook.baseUrl}/insecure-send-happy-birthday-emails`, {
	username,
	password
});

console.logOnNewLine(`Response from Yahoo: ${yahooResponse}`);

await sleep(2000);

console.logOnNewLine(`Response from Facebook: ${facebookResponse}`);

await sleep(2000);

console.logOnNewLine('Ight, imma head out 🚪🏃\n');

function sleep(milliseconds) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
}