#!/usr/bin/env bash

# QUALITY=1

# (sleep 5s && (
# 	alsa_out -j "alsa_out" -d hw:1,0 -c 2 -r 44100 -q $QUALITY &
# 	alsa_in -j "alsa_in" -d hw:1,0 -c 1 -q $QUALITY &
# )) &

# jackd -d dummy -r -p 8


# jackd -P70 -p16 -dalsa -dhw:1,0 -p2048 -r44100 -i1 -o2 -n3 -s
# jackd -P70 -p16 -dalsa -dhw:1,0 -p1024 -r44100 -i1 -o2 -n3 -s
# jackd -P70 -p512 -dalsa -dhw:1,0 -p1024 -r44100 -i1 -o2 -n3 -s
# jackd -P70 -p8 -dalsa -dhw:1,0 -r44100 -i1 -o2 -n4 -s -S
# jackd -p8 -dalsa -dhw:1,0 -r44100 -i1 -o2 -n4 -s -S -p4096
# jackd -r -p4 -dalsa -dhw:1,0 -r44100 -i1 -o2 -n4 -s -S -p2048 -znone
jackd -r -p8 -dalsa -dhw:1,0 -i1 -o2 -n4 -s -S -p2048 -znone

