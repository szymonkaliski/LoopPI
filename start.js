var spawn = require("child_process").spawn;

var logStd = function(spawned) {
	[ "stdout", "stderr" ].forEach(function(key) {
		spawned[key].on("data", function(data) {
			console.log(data.toString());
		});
	});
};

// start jack
var jackd = spawn("jackd", [ "-P60", "-p8", "-dalsa", "-dhw:1,0", "-i1", "-o2", "-n3", "-r44100", "-s", "-S", "-znone" ]);
logStd(jackd);

// wait 1 second and start chuck
setTimeout(function() {
	var chuckLooper = spawn("chuck", [ "--in1", __dirname + "/Looper/looper.ck"]);
	logStd(chuckLooper)
}, 1000);

// wait another second and start controller app
setTimeout(function() {
	var controller = spawn("node", [ __dirname + "/Controller/app.js" ]);
	logStd(controller);
}, 2000);

process.on("SIGINT", function() {
	// force kill jack
	spawn("killall", [ "jackd" ]);
	process.exit();
});
