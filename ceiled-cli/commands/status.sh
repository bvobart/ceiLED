# Displays the status of CeiLED by calling docker-compose ps.
function status {
  cd "$CEILED_DIR" || return
  docker-compose ps
}
