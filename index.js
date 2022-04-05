#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const net = require('net')

var config = require('./config')

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
		var available = await ping(config.host, config.port);
		var data = {success: available, url: config.protocol + config.host + ':' + config.port}
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(JSON.stringify(data));
		if (available) process.exit(0)
	}
	else res.end();
});

console.log(`NodeJS Waiter listening on port ${config.listenPort}.\nWaiting for connections to: ${config.protocol}${config.host}:${config.port}`);

app.listen(config.listenPort);
