# Starts CeiLED by calling docker-compose up -d. 
# Additionally uses docker-compose.debug.yml if in debug mode
function start {
  cd $CEILED_DIR
  if is_debug; then 
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml up -d
  else
    docker-compose up -d
  fi
}
