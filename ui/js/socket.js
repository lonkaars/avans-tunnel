import api from './api.js';

var ws = new WebSocket('ws://localhost:8081/');
export default ws;

ws.addEventListener("message", ev => {
	// this will already throw an error if the message doesn't contain valid JSON
	const msg = JSON.parse(ev.data);

	// check if api.msg.handle has a handler for message type
	if (!api.msg.handle.hasOwnProperty(msg.type)) {
		console.warn(`No message handler for type ${msg.type}`, msg);
		return;
	}

	// run the appropriate message handler
	api.msg.handle[msg.type](msg);
});

ws.addEventListener("close", () => {
	console.error("WebSocket closed!");
});

ws.addEventListener("open", _ev => {
	api.msg.send.connected();
});

