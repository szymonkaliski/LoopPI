# LoopPI

4 track audio looper working on Raspberry PI, made with ChucK and Node.js

## About

LoopPI is standalone audio looper made with Raspberry PI, with audio part in ChucK, and interface (8 hardware buttons and 8 potentiometers) in Node.js. You can see it in action in [this video](https://vimeo.com/108919777).

Each row of controls consists of two buttons and two potentiometeres. First button toggles recording on and off, second one clears the loop, first potentiometer controlls the loop volume, and second one controls feedback.

Each loop is 8 seconds long, with independent volume and feedback controls.

Raspberry PI is running on ArchLinux ARM, headless, with only bare essentials installed. Audio processing application written in ChucK is receiving OSC signals, send from Node.js based interface to communicate with GPIO. The electronics part consist of MCP3008 for analog-digital conversion for potentiometers, and SN74151 multiplexer for eight input buttons. There's also LCD screen which displays current status of the looper. You really should see [the video](https://vimeo.com/108919777).

Audio is driven by cheap [Delock USB Sound Adapter](http://www.delock.com/produkte/G_61645/merkmale.html?setLanguage=en).

## Config

Some small changes were made to make the most out of this little machine:

* swap was disabled to prevent audio cracks
* cpu was overclocked to 800MHz
* cpu governor was changed to "performance" (using `cpupower` package, with config in `/etc/default/cpupower`)
* onboard soundcard was disabled (`/etc/modules-load.d/raspberrypi.conf` - `snd-bcm2835` was removed)
* jack (required by ChucK) was installed from AUR with dbus disabled (using package `jack2-no-dbus-git`)

## LCD

For display I've used JHD204A LCD compatybile with popular HD44780, wiring:

* RS: gpio 18 - pin 12
* R/W: GND
* E: gpio 23 - pin 16
* D4: gpio 4 - pin 7
* D5: gpio 17 - pin 11
* D6: gpio 21/27 - pin 13
* D7: gpio 22 - pin 15
* V0: 1V

## Installation

Well, it's not as easy as `git pull`, and there's a lot you need to figure out by yourself, but I hope this repo will bring at least some building blocks. On my looper, everything is started by `crontab` with simple `@reboot node $HOME/LoopPI/start.js` which takes care of starting `jackd`, interface and audio application.

Some config files also might be usable, especially `asound.conf` to use external USB audio input and output.

## This Repo

To help you get around:

* `Configs/` - various Raspberry PI configs taken from my box
* `Controller/` - Node.js application to interface between GPIO and OSC
* `Experiments/` - sample code and other experiments I made while developing this
* `Looper/` - various ChucK loopers (including experimental one using single `LiSa` object, which doesn't really work now), currently I'm using `looper-class.ck`
