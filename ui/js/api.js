import ws from './socket.js';

export default {
	msg: {
		send: {
			helloWorld: () => {
				ws.send(JSON.stringify({res: 'OK'}));
			}
		},
		handle: {
			helloWorld: msg => {
				console.log(msg);
			},
		},
	},
};

