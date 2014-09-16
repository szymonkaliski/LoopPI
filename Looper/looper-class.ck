class Loop {
  LiSa loop;

  fun void init(Gain input) {
    input => loop => dac;
    8::second => loop.duration;

    1 => loop.play;
    1 => loop.loop;
    1 => loop.loopRec;
    1 => loop.maxVoices;
  }

  fun void record(int status) {
    if (status) { loop.playPos() => loop.recPos; }

    loop.record(status);
  }

  fun void clear(int status) {
    if (status) { loop.clear(); }
  }

  fun void volume(float value) {
    loop.voiceGain(0, value);
  }

  fun void feedback(float value) {
    loop.feedback(value);
  }
}

Loop loop[4];

class OscListener {
  function void listenOnOsc(string msg, int port) {
    OscRecv recv;
    port => recv.port;

    recv.listen();
    recv.event(msg) @=> OscEvent event;

    while (true) {
      event => now;
      while (event.nextMsg()) { receiveEvent(event); }
    }
  }

  function void receiveEvent(OscEvent event) {}
}

class ListenRecording extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getInt() => int status;

    loop[chan].record(status);
  }
}

class ListenFeedback extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getFloat() => float value;

    loop[chan].feedback(value);
  }
}

class ListenVolume extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getFloat() => float value;

    loop[chan].volume(value);
  }
}

class ListenClear extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getInt() => int status;

    loop[chan].clear(status);
  }
}

ListenRecording listenRecording;
ListenFeedback listenFeedback;
ListenVolume listenVolume;
ListenClear listenClear;

Gain inputGain;

0.75 => inputGain.gain;
adc => inputGain;

for (0 => int i; i < 4; i++) {
  loop[i].init(inputGain);
}

spork ~ listenRecording.listenOnOsc("/recording, i i", 3000);
spork ~ listenFeedback.listenOnOsc("/feedback, i f", 3000);
spork ~ listenVolume.listenOnOsc("/volume, i f", 3000);
spork ~ listenClear.listenOnOsc("/clear, i i", 3000);

while (true) {
  1::second => now;
}
