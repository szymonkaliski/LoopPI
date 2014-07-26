#!/usr/bin/env bash

# QUALITY=1

# (sleep 5s && (
# 	alsa_out -j "alsa_out" -d hw:1,0 -c 2 -r 44100 -q $QUALITY &
# 	alsa_in -j "alsa_in" -d hw:1,0 -c 1 -q $QUALITY &
# )) &

# jackd -d dummy -r -p 8


jackd -P70 -p16 -dalsa -dhw:1,0 -p128 -r44100 -i1 -o2 -n3 -s

