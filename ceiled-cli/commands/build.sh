# Builds CeiLED's Docker container by calling docker-compose build.
function build {
  cd $CEILED_DIR
  docker-compose -f docker-compose.dev.yml build "$@"
}
