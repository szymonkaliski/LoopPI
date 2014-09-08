var OSC = require("omgosc");
var sender = new OSC.UdpSender("127.0.0.1", 3000);

function LoopControl(number, mcp3008, sn74151) {
	this.mcp3008 = mcp3008;
	this.sn74151 = sn74151;

	this.index = number;
	this.recordIndex = 2 * number;
	this.clearIndex = 2 * number + 1;
	this.volumeIndex = 2 * number;
	this.feedbackIndex = 2 * number + 1;

	console.log(this.index, this.recordIndex, this.clearIndex, this.volumeIndex, this.feedbackIndex);

	this.recordState = 0;
	this.clearState = 0;
	this.volumeValue = 0;
	this.feedbackValue = 0;
}

LoopControl.prototype.update = function() {
	var recordState = this.sn74151.read(this.recordIndex);
	var clearState = this.sn74151.read(this.clearIndex);
	var volumeValue = this.mcp3008.read(this.volumeIndex);
	var feedbackValue = this.mcp3008.read(this.feedbackIndex);

	if (recordState !== this.recordState) {
		this.recordState = recordState;
		this.send("recording");
	}

	if (clearState !== this.clearState) {
		this.clearState = clearState;
		this.send("clear");
	}

	if (volumeValue !== this.volumeValue) {
		this.volumeValue = volumeValue;
		this.send("volume");
	}

	if (feedbackValue !== this.feedbackValue) {
		this.feedbackValue = feedbackValue;
		this.send("feedback");
	}
};

LoopControl.prototype.get = function() {
	return {
		record: this.recordState,
		clear: this.clearState,
		volume: Math.floor(this.volumeValue * 100),
		feedback: Math.floor(this.feedbackValue * 100)
	};
};

LoopControl.prototype.send = function(control) {
	var controlMap = {
		recording: { key: "recordState", type: "i" },
		feedback: { key: "feedbackValue", type: "f" },
		volume: { key: "volumeValue", type: "f" },
		clear: { key: "clearState", type: "i" }
	};

	if (controlMap[control]) {
		var options = [
			"/" + control,
			"i" + controlMap[control].type,
			[ this.index, this[controlMap[control].key] ]
		];

		// console.log("sending", options);
		sender.send.apply(sender, options);
	}
};

module.exports = LoopControl;
