#!/usr/bin/env bash

# (sleep 5s && (
# 	jack_connect "alsa_in:capture_1" "ChucK:inport 0" &
# 	jack_connect "ChucK:outport 0" "alsa_out:playback_1" &
# 	jack_connect "ChucK:outport 1" "alsa_out:playback_2" &
# )) &

echo "ChucK => started"
# chuck --loop --bufsize4096 --in1
chuck --loop --in1
