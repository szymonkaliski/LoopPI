var OSC = require("omgosc");
var sender = new OSC.UdpSender("127.0.0.1", 3000);

function LoopControl(number, mcp3008, sn74151) {
	this.mcp3008 = mcp3008;
	this.sn74151 = sn74151;

	this.index = number;

	this.buttons = {
		recording: { index: 2 * number + 1, state: 0, value: 0, type: "toggle" },
		clear: { index: 2 * number, state: 0, value: 0, type: "bang" }
	};

	this.knobs = {
		volume: { index: 2 * number, value: 0 },
		feedback: { index: 2 * number + 1, value: 0 }
	};
}

LoopControl.prototype.update = function() {
	this.updateButtons();
	this.updateKnobs();
};

LoopControl.prototype.updateButtons = function() {
	[ "recording", "clear" ].forEach(function(key) {
		var reading = !this.sn74151.read(this.buttons[key].index);

		if (reading == true && this.buttons[key].prev == false) {
			this.buttons[key].value = !this.buttons[key].value;
			this.send(key);
		}
		else if (this.buttons[key].type === "bang") {
			this.buttons[key].value = false;
		}

		this.buttons[key].prev = reading;
	}.bind(this));
};

LoopControl.prototype.updateKnobs = function() {
	[ "volume", "feedback" ].forEach(function(key) {
		var reading = this.mcp3008.read(this.knobs[key].index);

		if (reading !== this.knobs[key].value) {
			this.knobs[key].value = reading;
			this.send(key);
		}
	}.bind(this));
};

LoopControl.prototype.get = function() {
	return {
		record: this.buttons.recording.value,
		clear: this.buttons.clear.value,
		volume: Math.floor(this.knobs.volume.value * 100),
		feedback: Math.floor(this.knobs.feedback.value * 100)
	};
};

LoopControl.prototype.send = function(control) {
	var controlMap = {
		recording: { key: "buttons", type: "i" },
		clear: { key: "buttons", type: "i" },
		volume: { key: "knobs", type: "f" },
		feedback: { key: "knobs", type: "f" }
	};

	var value = controlMap[control];
	if (value) {
		var options = [
			"/" + control,
			"i" + value.type,
			[ this.index, this[value.key][control].value ]
		];

		// console.log("sending", options);
		sender.send.apply(sender, options);
	}
};

module.exports = LoopControl;
