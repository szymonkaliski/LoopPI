LiSa loop;
Gain inputGain;

dur loopLength;
8::second => loopLength;
4 * loopLength => loop.duration;
4 => loop.maxVoices;
0.75 => inputGain.gain;

adc => inputGain => loop => dac;

for (0 => int i; i < 4; i++) {
  loop.loopStart(i, i * loopLength);
  loop.loopEnd(i, (i + 1) * loopLength);
  loop.play(i, 1);
  loop.loop(i, 1);

  <<< i, loop.loopStart(i), loop.loopEnd(i) >>>;
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

    if (status) { loop.recPos(loop.playPos(chan)); }
    loop.record(status);
  }
}

class ListenFeedback extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getFloat() => float value;

    loop.feedback(value);
  }
}

class ListenVolume extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getFloat() => float value;

    loop.voiceGain(chan, value);
  }
}

// FIXME: not working!
fun void clear(int chan) {
  float startPos, endPos;
  int sample;

  loop.record(0);
  loop.recPos(loop.loopStart(chan));

  loop.loopStart(chan) / 1::samp => startPos;
  loop.loopEnd(chan) / 1::samp => endPos;
  startPos $ int => sample;

  <<< "clearing...", sample::samp >>>;

  while (sample < endPos) {
    (0, sample::samp) => loop.valueAt;
    sample++;

    // advance time to avoid drops
    if (sample % 32 == 0) { 10::samp => now; }
  }

  <<< "cleared!", sample::samp >>>;
}

class ListenClear extends OscListener {
  function void receiveEvent(OscEvent event) {
    event.getInt() => int chan;
    event.getInt() => int shouldClear;

    if (shouldClear) {
      clear(chan);
    }
  }
}

ListenRecording listenRecording;
ListenFeedback listenFeedback;
ListenVolume listenVolume;
ListenClear listenClear;

spork ~ listenRecording.listenOnOsc("/recording, i i", 3000);
spork ~ listenFeedback.listenOnOsc("/feedback, i f", 3000);
spork ~ listenVolume.listenOnOsc("/volume, i f", 3000);
spork ~ listenClear.listenOnOsc("/clear, i i", 3000);

while (true) {
  1::second => now;
}
