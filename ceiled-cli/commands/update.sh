function update {
  cd $CEILED_DIR
  if is_debug; then
    docker-compose -f docker-compose.yml -f docker-compose.debug.yml pull
  else
    docker-compose pull
  fi
}
