import axios from 'axios';
import { facebook, yahoo } from '../config/config.mjs';

const token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vbG9jYWxob3N0OjMwMTAiLCJzdWJqZWN0IjoicHJpdmlsZWdlZC1jbGllbnQtaWQiLCJhdWRpZW5jZSI6Imh0dHBzOi8vZ29vZ2xlLmNvbS8iLCJpc3N1ZWRBdCI6MTY5OTYzNzI3NSwiZXhwaXJlcyI6MTY5OTcyMzY3NSwicGVybWlzc2lvbnMiOiJyZWFkLWNvbnRhY3RzIHJlYWQtZW1haWwtYWRkcmVzcyByZWFkLWVtYWlscyBkZWxldGUtYWNjb3VudCIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImlhdCI6MTY5OTYzNzI3NX0.oR0-S9Mm8lnWNstko7d-kFKsKhwC2TYRJ0qaGijKFEYA-sHXyxeWr1cynAVVYlDhCIPEfSk-BFMzAUTfX8_O8w';

// console.logOnNewLine('😴...');

// await sleep(3000);

// console.logOnNewLine('🥱...');

// await sleep(3000);

// console.logOnNewLine('☕ 👀');

// await sleep(3000);

// console.logOnNewLine(`"Alright, let's see who has a birthday today 🔍..."`);

// await sleep(4000);

// console.logOnNewLine(`🔍...`);

// await sleep(1000);

// console.logOnNewLine(`🔍...`);

// await sleep(1000);

// console.logOnNewLine(`🔍...`);

// await sleep(1000);

// console.logOnNewLine(`Ah, grandpa has a birthday!  Sending out "Happy Birthday" messages!`);

// await sleep(4000);

const { data: yahooResponse } = await axios.post(`${yahoo.baseUrl}/secure-send-happy-birthday-emails`, {
	token
});
const { data: facebookResponse } = await axios.post(`${facebook.baseUrl}/secure-send-happy-birthday-emails`, {
	token
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