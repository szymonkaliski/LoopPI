var LCD = require("lcd");
var lcd = new LCD({
	rs: 18,
	e: 23,
	data: [ 4, 17, 27, 22 ],

	cols: 20,
	rows: 4
});

lcd.on("ready", function() {
	setInterval(function() {
		lcd.setCursor(0, 0);
		lcd.print("HELLO");

		lcd.once("printed", function() {
			lcd.setCursor(0, 1);
			lcd.print("WORLD!");
		});
	}, 1000);
});

process.on("SIGINT", function() {
	lcd.clear();
	lcd.close();
	process.exit();
});
