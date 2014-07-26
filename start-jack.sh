#!/usr/bin/env bash

QUALITY=4

(sleep 5s && (
	alsa_out -j "alsa_out" -d hw:1,0 -c 2 -r 44100 -q $QUALITY &
	alsa_in -j "alsa_in" -d hw:1,0 -c 1 -q $QUALITY &
)) &

jackd -d dummy -r

