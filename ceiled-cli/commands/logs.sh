# Prints the logs of CeiLED by calling docker-compose logs.
# Any arguments to this function will be passed directly to docker-compose logs.
function logs {
  cd $CEILED_DIR
  docker-compose logs $@
}
