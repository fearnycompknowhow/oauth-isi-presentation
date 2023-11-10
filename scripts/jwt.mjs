import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

// JWT (JSON Web Token) - Signs data which means that the data cannot be tampered with

// This is your secret/signing key.  THIS CANNOT LEAK
const SIGNING_KEY = fs.readFileSync('./private-key.pem').toString();
const PUBLIC_KEY = fs.readFileSync('./public-key.pem').toString();

const ticket1 = {
	seat: 'A1',
	movie: 'Lord of the Rings',
	expirationDate: 'October 28, 2023',
	theater: 'Goetz Theatres'
};

// console.log(jwt.sign(ticket1, SIGNING_KEY, { algorithm: 'ES256' }));

const token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWF0IjoiQTEiLCJtb3ZpZSI6IkxvcmQgb2YgdGhlIFJpbmdzIiwiZXhwaXJhdGlvbkRhdGUiOiJPY3RvYmVyIDI5LCAyMDIzIiwidGhlYXRlciI6IkdvZXR6IFRoZWF0cmVzIiwiaWF0IjoxNjk5NjMyNDc3fQ.W9hvQl-N4Wi71mwBTUXujb9OESTWueQSDFb3xJXxq410flY_9oe4xS2Otw-rPM3YiuvN1yU_gWtFwGQvpCSSbA';

try {
	const verificationResult = jwt.verify(token, PUBLIC_KEY, { algorithm: 'ES256' });

	console.log(chalk.green('Success!'));
	console.log(verificationResult);
}
catch (error) {
	console.error(chalk.red('Error: ') + error.message);
}