OscRecv recv;

3000 => recv.port;
recv.listen();

function void recording_shred() {
  <<< "recording" >>>;
  recv.event("/recording, i i") @=> OscEvent event;

  while (true) {
    event => now;

    while (event.nextMsg() != 0) {
      event.getInt() => int chan;
      event.getInt() => int status;

      <<< "chan", chan, "status", status >>>;
    }
  }
}

function void feedback_shred() {
  <<< "feedback" >>>;
  recv.event("/feedback, i f") @=> OscEvent event;

  while (true) {
    event => now;

    while (event.nextMsg() != 0) {
      event.getInt() => int chan;
      event.getFloat() => float feedback;

      <<< "chan", chan, "feedback", feedback >>>;
    }
  }
}

spork ~ recording_shred();
spork ~ feedback_shred();

while (true) {
 1::second => now;
}





