import './socket.js';

import api from './api.js';
window.api = api; // export api to inline JS handlers

// Initialize a counter to keep track of the row number
var rowCount = 1;

// JavaScript for adding a row dynamically at the top
document.getElementById("addRowBtn").addEventListener("click", () => {
	var table = document.getElementById("myTable");
	var row = table.insertRow(1); // Insert row at the top of the table
	var cell = row.insertCell(0); // Insert cell into the row
	cell.innerHTML = "Hallo siem ik ben dit aan het testen. er blijven maar 10 statussen in deze tabel " + rowCount++; // Add content to the cell with incremented counter
	var size = table.rows.length;
	var lastRowIndex = table.rows.length - 1; // Index of the last row
	if (size > 11) { // Check if there is more than one row (excluding the header row)
		table.deleteRow(lastRowIndex); // Delete the last row
	}
});

function onOffButton(btn) {
	var newState = !!Number(btn.value); // Boolean("0") == true
	var dot = btn.parentNode.parentNode.querySelector('.dot');
	dot.classList.remove("on");
	dot.classList.remove("off");
	dot.classList.add(newState ? "on" : "off");
}
window.onOffButton = onOffButton;

