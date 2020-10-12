# Prints the logs of CeiLED by calling docker-compose logs.
# Any arguments to this function will be passed directly to docker-compose logs.
function logs {
  cd $CEILED_DIR
  if is_debug; then
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml logs $@
  else
    docker-compose logs $@
  fi
}
