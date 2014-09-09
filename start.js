var spawn = require("child_process").spawn;

var priorities = {
	jackd: "-10",
	chuck: "-15",
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
niceSpawn(priorities.jackd, [ "jackd", "-P70", "-p8", "-dalsa", "-dhw:1,0", "-i1", "-o2", "-n3", "-r44100", "-s", "-S", "-znone" ]);

// start chuck and controller after timeout
setTimeout(function() {
	niceSpawn(priorities.node, [ "node", __dirname + "/Controller/app.js" ]);
	niceSpawn(priorities.chuck, [ "chuck", "--bufsize:4096", "--adaptive:1024", "--srate:44100", "--in1", __dirname + "/Looper/looper.ck"]);
}, 4000);

process.on("SIGINT", function() {
	// force kill jack
	spawn("killall", [ "jackd" ]);
	process.exit();
});

