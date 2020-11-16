# Scales a service $1 to have $2 replicas.
function scale_service {
  docker-compose $compose_args up -d --no-deps --scale $1=$2 $1
}

# Restarts a single CeiLED service with name $1 by doing a rolling update.
# Expects that $1 is one of either [server, driver, mongodb].
function restart_service {
  local container_id=$(docker-compose ps -q $1)
  print_yellow "--> Starting new instance of ceiled-$1..."
  [[ -n "$container_id" ]] && scale_service $1 2 || scale_service $1 1
  sleep 1

  if [[ -n "$container_id" ]]; then
    print_yellow "--> Removing old instance of ceiled-$1..."
    docker kill -s SIGTERM $container_id &> /dev/null || true
    sleep 1
    docker rm -f $container_id &> /dev/null || true
  fi

  [[ -n "$container_id" ]] && scale_service $1 1
}

# Restarts ceiled-web without a rolling update, as it binds to ports on the host.
function restart_web {
  docker-compose $compose_args up -d --no-deps web
}

# Restarts all CeiLED service by doing a rolling update, except for ceiled-web.
function restart_all {
  local driver_id=$(docker-compose ps -q driver)
  local mongodb_id=$(docker-compose ps -q mongodb)
  local server_id=$(docker-compose ps -q server)

  print_yellow "--> Starting new services..."
  [[ -n "$driver_id" ]] && scale_service driver 2 || scale_service driver 1
  [[ -n "$mongodb_id" ]] && scale_service mongodb 2 || scale_service mongodb 1
  [[ -n "$server_id" ]] && scale_service server 2 || scale_service server 1
  restart_web
  sleep 1

  if [[ -n "$driver_id" ]] || [[ -n "$mongodb_id" ]] || [[ -n "$server_id" ]]; then
    print_yellow "--> Removing old services..."
    docker kill -s SIGTERM $driver_id $mongodb_id $server_id &> /dev/null || true
    sleep 1
    docker rm -f $driver_id $mongodb_id $server_id &> /dev/null || true
  fi
  
  [[ -n "$driver_id" ]] && scale_service driver 1
  [[ -n "$mongodb_id" ]] && scale_service mongodb 1
  [[ -n "$server_id" ]] && scale_service server 1
  true
}

# Restarts CeiLED if it is running, or starts it if it doesn't. 
# Additionally uses docker-compose.debug.yml if in debug mode
function restart {
  cd $CEILED_DIR

  local compose_args=""
  if is_debug; then local compose_args="-f docker-compose.yml -f docker-compose.debug.yml"; fi

  if [[ "$1" == "server" || "$1" == "driver" || "$1" == "mongodb" ]]; then
    print_yellow "--> Restarting ceiled-$1..."
    restart_service "$1"
  elif [[ "$1" == "web" ]]; then
    print_yellow "--> Restarting ceiled-web..."
    restart_web
  else
    # by default, restart all services
    print_yellow "--> Restarting all CeiLED's services..."
    restart_all 
  fi

  print_green "--> Done!"
}
