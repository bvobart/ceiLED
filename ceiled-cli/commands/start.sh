# Starts CeiLED by calling docker-compose up -d.
function start {
  cd $CEILED_DIR
  docker-compose up -d
}
