LiSa loop[4];

0 => int passGainEnabled;

float gainIn, gainOut;
1 => gainIn;
1 => gainOut;

Gain looperGain;
Gain inputGain;

gainIn => inputGain.gain;
gainOut => looperGain.gain;

if (passGainEnabled) {
  Gain passGain;
  gainIn => passGain.gain;
}

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

    <<< "chan", chan, "recording", status >>>;
    loop[chan].record(status);
  }
}

class ListenFeedback extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getFloat() => float value;

    <<< "chan", chan, "feedback", value >>>;
    loop[chan].feedback(value);
  }
}

class ListenVolume extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getFloat() => float value;

    <<< "chan", chan, "volume", value >>>;
    loop[chan].voiceGain(0, value);
  }
}

class ListenClear extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getInt() => int shouldClear;

    if (shouldClear) {
      <<< "chan", chan, "clear" >>>;
      loop[chan].clear();
    }
  }
}

ListenRecording listenRecording;
ListenFeedback listenFeedback;
ListenVolume listenVolume;
ListenClear listenClear;

if (passGainEnabled) {
  adc => passGain => dac;
}

adc => inputGain;
looperGain => dac;

for (0 => int i; i < 4; i++) {
  inputGain => loop[i] => looperGain;
  10::second => loop[i].duration;

  loop[i].rate(1.0);
  loop[i].play(1);
  loop[i].loop(1);
  loop[i].feedback(1);

  <<< "settings up loop: ", i, " duration: ", loop[i].duration() >>>;
}

<<< "sporking osc listeners..." >>>;

spork ~ listenRecording.listenOnOsc("/recording, i i", 3000);
spork ~ listenFeedback.listenOnOsc("/feedback, i f", 3000);
spork ~ listenVolume.listenOnOsc("/volume, i f", 3000);
spork ~ listenClear.listenOnOsc("/clear, i i", 3000);
/* spork ~ listenGlobalGain.listenOnOsc("/global-gain, f", 3000); */

<<< "starting main loop..." >>>;

while (true) {
  1::second => now;
}
