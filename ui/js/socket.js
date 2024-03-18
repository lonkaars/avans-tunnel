import api from './api.js';

var ws = new WebSocket('ws://localhost:8081/socket');
export default ws;

ws.onmessage = ev => {
	// this will already throw an error if the message doesn't contain valid JSON
	const msg = JSON.parse(ev.data);

	// check if api.msg.handle has a handler for msg.type
	if (!api.msg.handle.hasOwnProperty(msg.type)) {
		console.warn(`No message handler for type ${msg.type}`, msg);
		return;
	}

	// run the appropriate message handler
	api.msg.handle[msg.type](msg);
};

