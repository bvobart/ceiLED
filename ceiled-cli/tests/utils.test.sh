#!/bin/bash

set -e
cd $(dirname $0)

source ../utils.sh
source ./utils.sh

cd ..
export CEILED_CLI_DIR="$(pwd)"
export CEILED_DIR="$(pwd)/.."

function test_is_help() {
  run_test is_help "help"
  run_test is_help "--help"
  run_test is_help "-h"
}

function test_is_ceiled_dir() {
  run_test is_ceiled_dir $CEILED_DIR
  run_test not is_ceiled_dir $CEILED_CLI_DIR
  run_test not is_ceiled_dir "$CEILED_DIR/../ceiled-driver"
  run_test not is_ceiled_dir "$CEILED_DIR/../ceiled-server"
  run_test not is_ceiled_dir "$CEILED_DIR/../ceiled-web"
  run_test not is_ceiled_dir "non-existing-folder"
}

function test_is_in_envfile() {
  local original_dir="$CEILED_DIR"
  export CEILED_DIR="$CEILED_CLI_DIR/tests/resources"
  cd $CEILED_DIR
  echo "\
DEBUG=true
TEST=
PORT=1965
  INDENT=true
" > .env

  run_test is_in_envfile "DEBUG"
  run_test is_in_envfile "TEST"
  run_test is_in_envfile "PORT"
  run_test is_in_envfile "INDENT"
  run_test not is_in_envfile "FAKE"

  export CEILED_DIR="$original_dir"
  cd $CEILED_DIR
}

function test_use_device() {
  local original_dir="$CEILED_DIR"
  export CEILED_DIR="$CEILED_CLI_DIR/tests/resources"
  cd $CEILED_DIR

  echo "DEV_PCA9685=\n" > .env
  run_test use_device "DEV_PCA9685"
  run_test not use_device "DEV_JEMOEDER"

  export CEILED_DIR="$original_dir"
  cd $CEILED_DIR
}

function test_get_compose_files() {
  local original_dir="$CEILED_DIR"
  export CEILED_DIR="$CEILED_CLI_DIR/tests/resources"
  cd $CEILED_DIR


  export DEV="false"
  echo "" > .env
  run_test returns "-f docker-compose.yml" --- get_compose_files

  echo "DEV_PCA9685=\n" > .env
  run_test returns "-f docker-compose.yml -f docker-compose.pca9685.yml" --- get_compose_files
  
  export DEV="true"
  run_test returns "-f docker-compose.yml -f docker-compose.pca9685.yml -f docker-compose.dev.yml" --- get_compose_files

  echo "" > .env
  run_test returns "-f docker-compose.yml -f docker-compose.dev.yml" --- get_compose_files

  export CEILED_DIR="$original_dir"
  cd $CEILED_DIR  
}

test_suite test_is_help
test_suite test_is_ceiled_dir
test_suite test_is_in_envfile
test_suite test_use_device
test_suite test_get_compose_files

test_end
