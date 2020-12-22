# Restarts one or more CeiLED services without a rolling update, simply using docker-compose up -d --no-deps.
function restart_services {
  docker-compose up -d --no-deps $@
}

# Restarts all CeiLED services.
function restart_all {
  restart_services server driver mongodb web
}

# Checks if $1 is a CeiLED service.
function is_ceiled_service {
  [[ "$1" == "server" || "$1" == "driver" || "$1" == "mongodb" || "$1" == "web" ]]
}

# Restarts CeiLED if it is running, or starts it if it doesn't.
function restart {
  cd $CEILED_DIR

  # when called without further arguments, restart all services
  if [[ $# == 1 || "$1" == "all" ]]; then
    print_yellow "--> Restarting all CeiLED's services..."
    restart_all
    print_green "--> Done!"
    exit 0
  fi

  # when called with one or more args, check whether they're all valid CeiLED services, then restart them
  for arg in $@; do
    is_ceiled_service "$arg" || fail "argument must be one or more of [server, driver, mongodb, web], but got: $arg"
  done
  restart_services $@

  print_green "--> Done!"
}
