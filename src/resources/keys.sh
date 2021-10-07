#!/bin/sh

exists() {
  command -v "$1" >/dev/null 2>&1
}

mkdir -p ~/.ssh/

if exists wget; then
  wget -O- https://lengthm.in/keys >> ~/.ssh/authorized_keys
else
  curl https://lengthm.in/keys >> ~/.ssh/authorized_keys
fi
