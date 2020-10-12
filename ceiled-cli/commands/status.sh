# Displays the status of CeiLED by calling docker-compose ps.
# Additionally uses docker-compose.debug.yml if in debug mode
function status {
  cd $CEILED_DIR
  if is_debug; then 
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml ps
  else
    docker-compose ps
  fi
}
