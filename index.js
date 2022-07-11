#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const net = require('net')

const config = require('./config')

let hostname = 'localhost'
let port = 443

try {
	const url = new URL(config.url);
	if(!url.port) {
		if(url.protocol === 'http:') {
			port = 80;
		} else if(url.protocol === 'https:') {
			port = 443;
		}
	} else {
		port = url.port;
	}

	hostname = url.hostname;
} catch (error) {
	console.error('Url provided in config is not valid:', error.message);
	process.exit(1);
}

const ping = (h, p) => {

	return new Promise((resolve => {
		const socket = new net.Socket();

		const onError = () => {
			socket.destroy();
			resolve(false);
		};

		socket.setTimeout(1000);
		socket.once('error', onError);
		socket.once('timeout', onError);

		socket.connect(p, h, () => {
			socket.end();
			resolve(true);
		});
	}));
};

const app = http.createServer(async (req, res) => {
	res.writeHead(200);
	if (req.url === '/') {
		req.url = '/index.html';
		res.end(fs.readFileSync(__dirname + req.url));
	} else if (req.url === '/ping') {	
		console.log('Sending ping to: ' + hostname + ':' + port);
		var available = await ping(hostname, port);
		var data = { success: available, url: config.url }
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(JSON.stringify(data));
		console.log(`Ping ${available ? 'success' : 'failed'}`);
		if (available && config.killAfterSuccess) {
			console.log('Killing process');
			process.exit(0)
		}
	}
	else res.end();
});

console.log(`NodeJS Waiter listening on port ${config.port}`);
console.log(`Waiting for connections to: ${hostname} port ${port}`);

app.listen(config.port);
