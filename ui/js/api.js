import ws from './socket.js';

function send(obj) {
	ws.send(JSON.stringify(obj));
}

function setPolkaDot(el, bool) {
	el.classList.remove("on");
	el.classList.remove("off");
	el.classList.add(bool ? "on" : "off");
}

Array.prototype.average = function() {
	var sum = 0;
	for (let i = 0; i < this.length; i++)
		sum += this[i];
	return sum / this.length;
}

const api = {
	update: {
		barrier: open => setPolkaDot(document.getElementById("barrierValue"), open),
		trafficLights: state => document.getElementById("trafficLightsValue").innerText = state,
		lights: value => {
			document.getElementById("lightsValue").innerText = value * 10;
			document.getElementById("lightsInput").value = value;
		},
		matrix: state => document.getElementById("matrixValue").value = state,
		photocell: on => setPolkaDot(document.getElementById("photocellValue"), on),
		carSpeed: speed => {
			for (let i = 0; i < 4; i++)
				document.getElementById(`zone${i+1}SpeedValue`).innerText = speed[i];
		},
		carCount: count => {
			for (let i = 0; i < 4; i++)
				document.getElementById(`zone${i+1}CarsValue`).innerText = count[i];
		},
		notifications: msg => {
			var table = document.getElementById("myTable");
			var row = table.insertRow(1); // Insert row at the top of the table
			var cell = row.insertCell(0); // Insert cell into the row
			cell.innerHTML = msg.storingBericht; // Add content to the cell with incremented counter
			var size = table.rows.length;
			var lastRowIndex = table.rows.length - 1; // Index of the last row
			if (size > 11) { // Check if there is more than one row (excluding the header row)
				table.deleteRow(lastRowIndex); // Delete the last row
			}
			
			api.update.sos(msg.statusSOS);
		},
		sos: on => {
			document.getElementById("sosDialog")[on ? "showModal" : "close"]();
		},
		lfvReady: msg => {
			var { ready } = msg;
			document.getElementById("lfvReadyValue").innerText = ready ? "online" : "offline";
			var btn = document.getElementById("lfvReadyBtn")
			if (ready) {
				btn.removeAttribute("disabled");
			} else {
				btn.setAttribute("disabled", true);
			}
		},
		start: () => {
			document.getElementById("setupDialog").close();
		},
		cctvCtl: (pan, tilt, zoom) => {
			document.getElementById("cctvPanInput").value = pan;
			document.getElementById("cctvTiltInput").value = tilt;
			document.getElementById("cctvZoomInput").value = zoom;
		},
	},
	msg: {
		send: {
			connected: () => send({ type: 'connected' }),
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
			sos: el => {
				var statusSOS = el.value == "true";
				send({ type: 'sosBericht', statusSOS });
				api.update.sos(statusSOS);
			},
			start: () => {
				send({ type: 'start' });
				api.update.start();
			},
			cctvPreset: el => {
				var preset = el.value;
				send({ type: 'cctvPreset', preset });
			},
			cctvCtl: () => {
				var pan = document.getElementById("cctvPanInput").value;
				var tilt = document.getElementById("cctvTiltInput").value;
				var zoom = document.getElementById("cctvZoomInput").value;
				send({ type: 'cctvControl', pan, tilt, zoom });
				api.update.cctvCtl(pan, tilt, zoom);
			},
		},
		handle: {
			helloWorld: msg => console.log(msg),
			barrier: msg => api.update.barrier(msg.open),
			trafficLights: msg => api.update.trafficLights(msg.state),
			lights: msg => api.update.lights(msg.value),
			matrix: msg => api.update.matrix(msg.state),
			photocell: msg => api.update.photocell(msg.on),
			autoPerZone: msg => api.update.carCount(msg.autos),
			sosBericht: msg => api.update.notifications(msg),
			lfvReady: msg => api.update.lfvReady(msg),
			cctvControl: msg => api.update.cctvCtl(msg.pan, msg.tilt, msg.zoom),
		},
	},
};

export default api;
