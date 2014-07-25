KBHit kb;

adc => LiSa loop => dac;
1::second => loop.duration;

loop.rate(1);
loop.play(1);
loop.loop(1);
loop.recRamp(200::ms);

while (true) {
  kb => now;

  while (kb.more()) {
    if (kb.getchar() == 32) {
      <<< "recording" >>>;
      loop.record(1);
      1000::ms => now;
      loop.record(0);
    }
  }
}
