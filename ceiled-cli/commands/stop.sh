# Stops CeiLED by running docker-compose down.
function stop {
  cd "$CEILED_DIR" || return
  docker-compose down
}
