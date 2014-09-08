var Gpio = require("onoff").Gpio;

var padNumber = function(number, padding) { 
	return (1e15 + number + "").slice(-padding);
};

function SN74151(settings) {
	this.a = new Gpio(settings.a, "out");
	this.b = new Gpio(settings.b, "out");
	this.c = new Gpio(settings.c, "out");
	this.in = new Gpio(settings.in, "in");
};

SN74151.prototype.read = function(input) {
	var bits = this.toBinary(input);
	this.c.writeSync(bits[0]);
	this.b.writeSync(bits[1]);
	this.a.writeSync(bits[2]);

	return this.in.readSync();
};

SN74151.prototype.toBinary = function(input) {
	var binary = Number(input).toString(2);
	var paddedString = padNumber(binary, 3);
	var bitArray = paddedString.split("").map(Number);

	return bitArray;
};

module.exports = SN74151;
