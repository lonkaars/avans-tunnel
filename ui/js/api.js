import ws from './socket.js';

function send(obj) {
	ws.send(JSON.stringify(obj));
}

function setPolkaDot(el, bool) {
	el.classList.remove("on");
	el.classList.remove("off");
	el.classList.add(bool ? "on" : "off");
}

const api = {
	update: {
		barrier: open => setPolkaDot(document.getElementById("barrierValue"), open),
		trafficLights: state => document.getElementById("trafficLightsValue").innerText = state,
		lights: value => document.getElementById("lightsValue").innerText = value,
		matrix: state => document.getElementById("matrixValue").value = state,
		photocell: on => setPolkaDot(document.getElementById("photocellValue"), on),
		cctv: on => setPolkaDot(document.getElementById("cctvValue"), on),
	},
	msg: {
		send: {
			helloWorld: () => send({ type: 'helloWorld' }),
			barrier: el => {
				var open = el.value == "true"; // string to boolean
				send({ type: 'barrier', open });
				api.update.barrier(open);
			},
			trafficLights: el => {
				var state = el.value;
				send({ type: 'trafficLights', state });
				api.update.trafficLights(el.innerText);
			},
			lights: el => {
				var value = Number(el.value);
				send({ type: 'lights', value });
				api.update.lights(value);
			},
			matrix: el => {
				var state = el.value;
				send({ type: 'matrix', state });
				api.update.matrix(value);
			},
			photocell: el => {
				var on = el.value == "true";
				send({ type: 'photocell', on });
				api.update.photocell(on);
			},
			cctv: el => {
				var on = el.value == "true";
				send({ type: 'barrier', on });
				api.update.cctv(on);
			},
		},
		handle: {
			helloWorld: msg => {
				console.log(msg);
			},
		},
	},
};

export default api;
