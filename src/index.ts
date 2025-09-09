// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as A1lib from "alt1";
import { mixColor } from "alt1/base"
import * as ChatBoxReader from "alt1/chatbox"

// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import * as $ from "./jquery.js";


$(document).ready(() => {
	if (window.alt1) {
		alt1.identifyAppUrl("./appconfig.json");
		let timer = document.getElementById("beam_timer");
		timer.innerText = '0s';

	} else {
		let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
		var output = document.getElementById("output");
		output.innerHTML = `Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1`;
	}
});
import { _timer } from "./timer.js";
var beamTimer = new _timer(function (time) {
	let secs_left: number = parseFloat((Math.floor(time / 600) * 0.6).toFixed(1));
	$("#beam_timer").html(secs_left + "s");
	if (time <= 0) {
		beamTimer.stop();
	}
});

var fragTimer = new _timer(function (time) {
	let secs_left: number = parseFloat((Math.floor(time / 600) * 0.6).toFixed(1));
	$("#frag_timer").html(secs_left + "s");
	if (time <= 0) {
		fragTimer.stop();
	}
});

const appColor = A1lib.mixColor(0, 255, 0);
let reader = new ChatBoxReader.default();
let latestSnuffed = "00:00:00";
let latestInstance = "00:00:00";


reader.readargs = {
	colors: [
		mixColor(255, 255, 255),    // White (Timestamp)
		mixColor(127, 169, 255),    // Blue (Timestamp)
		mixColor(69, 131, 145), // Blue (Amascut)
		mixColor(153, 255, 153), // Green (Amascut's Voice)
		mixColor(0, 255, 0), // Green (Friends Chat)
		mixColor(200,50,50) // Red (Expire thing)
	],
}

function showSelectedChat(chat) {
	//Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
	try {
		alt1.overLayRect(
			appColor,
			chat.mainbox.rect.x,
			chat.mainbox.rect.y,
			chat.mainbox.rect.width,
			chat.mainbox.rect.height,
			3000,
			5
		);
	} catch { }
}
// Find all visible chatboxes on screen
let findChat = setInterval(function () {
	if (reader.pos === null)
		reader.find();
	else {
		clearInterval(findChat);

		if (localStorage.ccChat) {
			reader.pos.mainbox = reader.pos.boxes[localStorage.ccChat];
		} else {
			// If multiple boxes are found, this will select the first, which should be the top-most chat box on the screen.
			reader.pos.mainbox = reader.pos.boxes[0];
		}

		showSelectedChat(reader.pos);

		setInterval(function () {
			readChatbox();
		}, 100);
	}
}, 1000);

function snuffThemOut(lines) {
	// Detect if any lines have "Your light will be snuffed out", and if so, print them to the console
	for (const line of lines) {
		if (line.text.includes("This arena will expire in")) {
			latestInstance = line.fragments[1].text;
			console.log("New Instance detected: " + latestInstance);
		}
		if (line.text.includes("Your light will be snuffed out")) {
			// index 1 is the timestamp, index 2 is the chat message
			if (latestSnuffed !== line.fragments[1].text && latestSnuffed < line.fragments[1].text) {
				latestSnuffed = line.fragments[1].text;
				if(latestSnuffed > latestInstance && latestInstance != "00:00:00"){
					latestInstance = "00:00:00"; // Cringe solution
					fragTimer.reset(240);
					fragTimer.start(10);
				}
				beamTimer.reset(90);
				beamTimer.start(10);
			}
		}
	}
}

function readChatbox() {
	var opts = reader.read() || [];
	snuffThemOut(opts);
}

