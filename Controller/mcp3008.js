var Gpio = require("onoff").Gpio;

var padNumber = function(number, padding) { 
	return (1e15 + number + "").slice(-padding);
};

function MCP3008(settings) {
	this.clock = new Gpio(settings.clock, "out");
	this.cs = new Gpio(settings.cs, "out");
	this.in = new Gpio(settings.in, "in");
	this.out = new Gpio(settings.out, "out");
}

MCP3008.prototype.read = function(input) {
	this.cs.writeSync(1);
	this.clock.writeSync(0);
	this.cs.writeSync(0);

	var bits = this.selectChip(input);
	this.clockedWrite(bits);
	var reading = this.clockedRead();

	this.cs.writeSync(1);

	return reading;
};

MCP3008.prototype.selectChip = function(input) {
	var binary = Number(input).toString(2);
	var paddedString = "11" + padNumber(binary, 3); // first two bits need to be 1
	var bitArray = paddedString.split("").map(Number);

	return bitArray;
};

MCP3008.prototype.clockedWrite = function(bits) {
	bits.forEach(function(bit) {
		this.out.writeSync(bit);
		this.clock.writeSync(1);
		this.clock.writeSync(0);
	}.bind(this));
};

MCP3008.prototype.clockedRead = function() {
	var i;
	var value = 0;
	var reading = 0;

	for (i = 12; i > 0; i--) {
		this.clock.writeSync(1);
		this.clock.writeSync(0);
		reading = this.in.readSync();

		value += reading ? Math.pow(i, 2) : 0;
	}

	return Math.ceil(value / 4) / 127;
};

module.exports = MCP3008;

