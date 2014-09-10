var spawn = require("child_process").spawn;

var priorities = {
	jackd: "-10",
	chuck: "-10",
	node: "10"
};

var options = {
	jackd: [
		"-P80",
		"-p8",
		"-dalsa",
		"-dhw:1,0",
		"-i1",
		"-o2",
		"-n3",
		"-r44100",
		"-p4096",
		"-s",
		"-S",
		"-znone"
	],
	node: [ __dirname + "/Controller/app.js" ],
	chuck: [
		// "--adaptive2048",
		"--bufsize4096",
		// "--bufsize8192",
		// "--bufsize16384",
		"--srate44100",
		"--in1",
		__dirname + "/Looper/looper.ck"
	]
}

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
niceSpawn(priorities.jackd, [ "jackd" ].concat(options.jackd));

// testing if this helps with audio problems?
setTimeout(function() { niceSpawn(0, [ "jack_bufsize", "4096" ]); }, 3000);
setTimeout(function() { niceSpawn(0, [ "jack_bufsize" ]); }, 3500);

// start chuck and controller after timeout
setTimeout(function() {
	niceSpawn(priorities.node, [ "node" ].concat(options.node));
	niceSpawn(priorities.chuck, [ "chuck" ].concat(options.chuck));
}, 4000);

process.on("SIGINT", function() {
	// force kill jack
	spawn("killall", [ "jackd" ]);
	process.exit();
});

