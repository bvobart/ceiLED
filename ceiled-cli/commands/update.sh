# Updates CeiLED by pulling in new updates on the current branch
function update {
  cd $CEILED_DIR
  local ref=$(git rev-parse --abbrev-ref HEAD)
  print_yellow "--> Fetching updates on $ref..."
  git pull origin $ref

  print_yellow "--> Fetching new Docker images"
  docker-compose pull
  print_green "--> Done!"
}
