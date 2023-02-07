#!/bin/sh

exists() {
  command -v "$1" >/dev/null 2>&1
}

mkdir -p ~/.ssh/

if exists wget; then
  wget -O- https://{{HOST}}/keys >> ~/.ssh/authorized_keys
else
  curl https://{{HOST}}/keys >> ~/.ssh/authorized_keys
fi

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
