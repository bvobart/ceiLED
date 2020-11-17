# Updates CeiLED by pulling in new updates on the current branch
function update {
  cd $CEILED_DIR
  local ref=$(git rev-parse --abbrev-ref HEAD)
  print_yellow "--> Fetching updates on $ref..."
  git pull origin $ref

  # check whether there's any new files that need to be tracked and pulled
  if [[ -f .git/info/sparse-checkout ]]; then
    local known_files=$(cat .git/info/sparse-checkout)
    local ceiled_files=$(echo_ceiled_files)

    if [[ $ceiled_files != $known_files ]]; then
      print_yellow "--> Fetching new files from $ref..."
      echo_ceiled_files > .git/info/sparse-checkout
      git pull origin $ref
    fi
  fi

  print_yellow "--> Fetching new Docker images"
  docker-compose pull
  print_green "--> Done!"
}
