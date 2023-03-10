# Starts CeiLED by calling docker-compose up -d.
function start {
  cd "$CEILED_DIR" || return
  docker-compose up -d
}
