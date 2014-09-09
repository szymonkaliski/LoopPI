var spawn = require("child_process").spawn;

var priorities = {
	jackd: "-15",
	chuck: "-10",
	node: "10"
};

var niceSpawn = function(priority, args) {
	var spawnArgs = [ "-n", priority ].concat(args);
	var spawned = spawn("nice", spawnArgs);

	[ "stdout", "stderr" ].forEach(function(key) {
		spawned[key].on("data", function(data) {
			console.log(data.toString());
		});
	});
};

// start jack
niceSpawn(priorities.jackd, [ "jackd", "-P60", "-p8", "-dalsa", "-dhw:1,0", "-i1", "-o2", "-n3", "-r44100", "-s", "-S", "-znone" ]);

// start chuck and controller after timeout
setTimeout(function() {
	niceSpawn(priorities.chuck, [ "chuck", "--in1", "--adaptive:512", __dirname + "/Looper/looper.ck"]);
	niceSpawn(priorities.node, [ "node", __dirname + "/Controller/app.js" ]);
}, 4000);

process.on("SIGINT", function() {
	// force kill jack
	spawn("killall", [ "jackd" ]);
	process.exit();
});

