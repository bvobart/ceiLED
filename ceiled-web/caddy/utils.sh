#!/bin/sh
# Utility functions

fail() {
  echo "Error: $1"
  exit 1
}

# Echoes to stderr
echo_err() { 
  echo "$@" 1>&2
}

# Tests if $1 is an address on LAN or not
# Returns false for localhost, but true for 127.x.x.x 
is_local_address() {
  # If $1 is .local address, return true.
  [[ "$(echo "$1" | grep -oE ".*\.local$")" != "" ]] && true && return

  # If the address is not an IP address and it's not a .local address, then it is a public domain, return false
  local ip="$(echo "$1" | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b')"
  [[ "$ip" = "" ]] && false && return

  # If the IP address is in ranges 192.168.0.0/16 172.16.0.0/12 10.0.0.0/8 then IP is local
  [[ "$(echo $ip | grep -oE '^127\.')" != "" ]] && true && return
  [[ "$(echo $ip | grep -oE '^10\.')" != "" ]] && true && return
  [[ "$(echo $ip | grep -oE '(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)')" != "" ]] && true && return
  [[ "$(echo $ip | grep -oE '^192\.168\.')" != "" ]] && true && return
}

# Tests if $1 ends with 'localhost' or not.
is_localhost() {
  [[ "$(echo "$1" | grep -oE ".*localhost$")" != "" ]] && true && return
}

parse_port() {
  echo "$1" | grep -oE ':[0-9]{2,5}' | sed 's/://g'
}

parse_host() {
  local port="$(parse_port $1 )"
  if [[ "${port}" == "" ]]; then
    echo "$1"
  else
    echo "$1" | sed s/:$port//g
  fi
}
