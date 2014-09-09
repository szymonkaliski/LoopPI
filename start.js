var spawn = require("child_process").spawn;

var logStd = function(spawned) {
	[ "stdout", "stderr" ].forEach(function(key) {
		spawned[key].on("data", function(data) {
			console.log(data.toString());
		});
	});
};

// start jack
var jackd = spawn("nice", [ "-n", "-10", "jackd", "-P60", "-p8", "-dalsa", "-dhw:1,0", "-i1", "-o2", "-n3", "-r44100", "-s", "-S", "-znone" ]);
logStd(jackd);

// start chuck and controller after timeout
setTimeout(function() {
	var chuckLooper = spawn("nice", [ "-n", "-5", "chuck", "--in1", "--adaptive:512", __dirname + "/Looper/looper.ck"]);
	logStd(chuckLooper)

	var controller = spawn("node", [ __dirname + "/Controller/app.js" ]);
	logStd(controller);
}, 4000);

process.on("SIGINT", function() {
	// force kill jack
	spawn("killall", [ "jackd" ]);
	process.exit();
});
