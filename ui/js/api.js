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
			document.getElementById("lightsValue").innerText = value;
			document.getElementById("lightsInput").value = value;
		},
		matrix: state => document.getElementById("matrixValue").value = state,
		photocell: on => setPolkaDot(document.getElementById("photocellValue"), on),
		cctv: on => setPolkaDot(document.getElementById("cctvValue"), on),
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
			cell.innerHTML = msg; // Add content to the cell with incremented counter
			var size = table.rows.length;
			var lastRowIndex = table.rows.length - 1; // Index of the last row
			if (size > 11) { // Check if there is more than one row (excluding the header row)
				table.deleteRow(lastRowIndex); // Delete the last row
			}
		},
	},
	msg: {
		send: {
			allState: () => send({ type: 'allState' }),
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
				send({ type: 'lights', value: value / 10 });
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
				send({ type: 'cctv', on });
				api.update.cctv(on);
			},
		},
		handle: {
			helloWorld: msg => console.log(msg),
			barrier: msg => api.update.barrier(msg.on),
			trafficLights: msg => api.update.trafficLights(msg.state),
			lights: msg => api.update.lights(msg.value),
			matrix: msg => api.update.matrix(msg.state),
			photocell: msg => api.update.photocell(msg.on),
			cctv: msg => api.update.cctv(msg.on),
			snelheidAutoPerZone: msg => api.update.carSpeed([
				msg.snelHedenToegang.average(),
				msg.snelHedeningang.average(),
				msg.snelHedencentrale.average(),
				msg.snelHedenverlating.average(),
			]),
			autoPerZone: msg => api.update.carCount(msg.autos),
			sosBericht: msg => api.update.notifications(msg.storingBericht),
		},
	},
};

export default api;
