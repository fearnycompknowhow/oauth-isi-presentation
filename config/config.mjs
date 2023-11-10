import chalk from 'chalk';

const originalConsoleLog = console.log;

console.log = (message) => {
	if (typeof message === 'string') {
		message = facebook.colorize(message);
		message = google.colorize(message);
		message = yahoo.colorize(message);
		message = drivetrak.colorize(message);
		message = spa.colorize(message);
	}

	originalConsoleLog(message);
};

console.logOnNewLine = (message) => {
	console.log(`\n${message}`);
};

export const facebook = {
	baseUrl: 'http://localhost:3000',
	port: 3000,
	log: (message) => console.log('Facebook: ' + message),
	colorize: (message) => message.replace(/Facebook/g, chalk.bold(chalk.blueBright('Facebook')))
};

export const  google = {
	baseUrl: 'http://localhost:3010',
	port: 3010,
	log: (message) => console.log('Google: ' + message),
	colorize: (message) => message.replace(/Google/g, chalk.bold(chalk.redBright('Google')))
};

export const yahoo = {
	baseUrl: 'http://localhost:3020',
	port: 3020,
	log: (message) => console.log('Yahoo: ' + message),
	colorize: (message) => message.replace(/Yahoo/g, chalk.bold(chalk.greenBright('Yahoo')))
};

export const drivetrak = {
	baseUrl: 'http://localhost:3030',
	redirectUris: [
		'http://localhost:3030/finish-auth'
	],
	port: 3030,
	log: (message) => console.log('DriveTrak: ' + message),
	colorize: (message) => message.replace(/DriveTrak/g, chalk.bold(chalk.yellowBright('DriveTrak')))
};

export const spa = {
	baseUrl: 'http://localhost:3040',
	redirectUris: [
		'http://localhost:3040/finish-implicit-flow',
		'http://localhost:3040/finish-authorization-code-flow',
		'http://localhost:3040/finish-authorization-code-with-pkce-flow'
	],
	port:3040,
	log: (message) => console.log('SPA: ' + message),
	colorize: (message) => message.replace(/SPA/g, chalk.bold(chalk.whiteBright('SPA')))
};