# Builds CeiLED's Docker container by calling docker-compose build.
function build {
  cd "$CEILED_DIR" || return
  docker-compose -f docker-compose.dev.yml build "$@"
}
