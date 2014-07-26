KBHit kb;

int recording;
0 => recording;

adc => LiSa loop => dac;
5::second => loop.duration;

loop.rate(1);
loop.play(1);
loop.loop(1);
/* loop.recRamp(200::ms); */
/* loop.loopRec(1); */
loop.feedback(1);

while (true) {
  kb => now;

  while (kb.more()) {
    if (kb.getchar() == 32) {
      if (recording) {
        0 => recording;
      }
      else {
        1 => recording;
      }

      <<< "recording: ", recording >>>;
      loop.record(recording);
    }
  }
}
