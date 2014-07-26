KBHit kb;
LiSa loop[4];

int recording[4];
int char;

adc => dac;

for (0 => int i; i < 4; i++) {
  adc => loop[i] => dac;
  10::second => loop[i].duration;

  loop[i].rate(1.0);
  loop[i].play(1);
  loop[i].loop(1);
  loop[i].feedback(1);

  <<< "settings up loop: ", i, " duration: ", loop[i].duration() >>>;
}

<<< "starting main loop..." >>>;

while (true) {
  kb => now;

  while (kb.more()) {
    kb.getchar() => char;
    char - 49 => char;

    if (char >= 0 && char <= 4) {
      if (recording[char]) {
        0 => recording[char];
      }
      else {
        1 => recording[char];
      }

      <<< "recording: ", char, " status: ", recording[char] >>>;
      loop[char].record(recording[char]);
    }
  }
}
