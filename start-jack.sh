#!/usr/bin/env bash

jackd -d dummy &
alsa_out -j "alsa_out" -d hw:1,0 -c 2 -r 44100 &
alsa_in -j "alsa_in" -d hw:1,0 -c 1

