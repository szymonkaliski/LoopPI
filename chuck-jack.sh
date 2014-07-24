#!/usr/bin/env bash

(sleep 3s && (
	jack_connect "ChucK:outport 0" "alsa_out:playback_1" &
	jack_connect "ChucK:outport 1" "alsa_out:playback_2" &
)) &

echo "ChucK => $1"
chuck $1
