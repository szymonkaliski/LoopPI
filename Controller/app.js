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

var padNumber = function(number, padding) { 
	return (1e15 + number + "").slice(-padding);
};

lcd.on("ready", function() {
	setInterval(function() {
		lcd.home();
		var readings = [];
		for (var i = 0; i < 8; i++) {
			readings[i] = sn74151.read(i);
			readings[i + 8] = padNumber(mcp3008.read(i), 3);
		}

		// lcd.clear();
		lcd.print(readings);
		// console.log(readings);

		// lcd.home();
		// for (var i = 0; i < 4; i++) {
		// 	lcd.setCursor(i * 3, 1);
		// 	lcd.print(padNumber(mcp3008.read(i), 3));
		// }

		// lcd.home();
		// for (var i = 0; i < 4; i++) {
		// 	lcd.setCursor(i * 3, 2);
		// 	lcd.print(padNumber(mcp3008.read(4 + i), 3));
		// }
	}, 400);
});


process.on("SIGINT", function() {
	lcd.clear();
	lcd.close();
	process.exit();
});
