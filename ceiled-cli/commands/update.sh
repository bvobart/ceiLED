# Updates CeiLED by pulling in new updates on the current branch
function update {
  cd $CEILED_DIR
  local ref=$(git rev-parse --abbrev-ref HEAD)
  print_yellow "--> Fetching updates on $ref..."
  git pull origin $ref

  print_yellow "--> Fetching new Docker images"
  if is_debug; then
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml pull
  else
    docker-compose pull
  fi
  print_green "--> Done!"
}
