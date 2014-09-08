var LCD = require("lcd");
var lcd = new LCD({
	rs: 18,
	e: 23,
	data: [ 4, 17, 27, 22 ],

	cols: 20,
	rows: 4
});

var MCP3008 = require("./mcp3008");
var mcp3008 = new MCP3008({
	clock: 10,
	cs: 7,
	in: 9,
	out: 11
});

var SN74151 = require("./sn74151");
var sn74151 = new SN74151({
	a: 25,
	b: 15,
	c: 14,
	in: 8
});

var LoopControl = require("./loop-control");
var loopControls = [];
var i;

for (i = 0; i < 4; i++) {
	loopControls[i] = new LoopControl(i, mcp3008, sn74151);
}

var padNumber = function(number, padding) { 
	return (1e15 + number + "").slice(-padding);
};

lcd.on("ready", function() {
	setInterval(function() {
		var readings = loopControls.map(function(loop) {
			loop.update();
			return loop.get();
		});

		var printReading = function(reading) {
			var print = [
				" ",
				reading.record ? "RECORD" : "      ",
				" | ",
				padNumber(reading.volume, 3),
				" | ",
				padNumber(reading.feedback, 3),
			].join("");

			lcd.print(print);
		};

		lcd.setCursor(0, 0);
		printReading(readings[0]);

		lcd.once("printed", function() {
			lcd.setCursor(0, 1);
			printReading(readings[1]);

			lcd.once("printed", function() {
				lcd.setCursor(0, 2);
				printReading(readings[2]);

				lcd.once("printed", function() {
					lcd.setCursor(0, 3);
					printReading(readings[3]);
				});
			});
		});
	}, 500);
});

process.on("SIGINT", function() {
	lcd.clear();
	lcd.close();
	process.exit();
});
