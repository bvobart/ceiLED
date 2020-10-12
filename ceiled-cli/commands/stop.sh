# Stops CeiLED by running docker-compose down.
function stop {
  cd $CEILED_DIR
  if is_debug; then
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml down
  else
    docker-compose down
  fi
}