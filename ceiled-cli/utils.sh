#-----------------
# General
#-----------------

function fail {
  print_red "!-> Error: $1"
  exit 1
}

function get_version {
  cat "$CEILED_CLI_DIR"/version
}

#-----------------
# Printing
#-----------------

# Prints $1 as red text
function print_red {
  local red='\033[0;31m'
  local nocolor='\033[0m'
  echo -e "${red}$1${nocolor}"
}

# Prints $1 as yellow text
function print_yellow {
  local yellow='\033[0;33m'
  local nocolor='\033[0m'
  echo -e "${yellow}$1${nocolor}"
}

# Prints $1 as green text
function print_green {
  local green='\033[0;32m'
  local nocolor='\033[0m'
  echo -e "${green}$1${nocolor}"
}

#-----------------
# Args
#-----------------

function is_dev {
  [[ $DEV == "true" ]]
}

# Checks if $1 is a help command / param
function is_help {
  [[ "$1" == "help" ]] ||
  [[ "$1" == "--help" ]] || 
  [[ "$1" == "-h" ]]
}

#-----------------
# Files & directories
#-----------------

# Prints the relative paths of the installed files and directories relative to $CEILED_DIR
# preceded by a / because it's meant to be thrown into .git/info/sparse_checkout
function echo_ceiled_files {
  echo "/docker-compose.yml"
  echo "/docker-compose.pca9685.yml"
  echo "/ceiled-cli"
  echo "/.env.sample"
  echo "/ReadMe.md"
}

# Copies CeiLED's files to the target directory $1
function copy_ceiled_files {
  cp "$CEILED_DIR"/docker-compose.yml "$1"
  cp "$CEILED_DIR"/docker-compose.pca9685.yml "$1"
  cp -r "$CEILED_DIR"/ceiled-cli "$1"
  cp "$CEILED_DIR"/.env.sample "$1"
  cp "$CEILED_DIR"/ReadMe.md "$1"
}

# Checks if $1 is a directory where CeiLED is installed.
function is_ceiled_dir {
  [[ -f "$1/docker-compose.yml" ]] &&
  [[ -f "$1/docker-compose.pca9685.yml" ]] &&
  [[ -d "$1/ceiled-cli" ]] &&
  [[ -f "$1/ceiled-cli/ceiled" ]]
}

# Asserts that $1 is a directory where CeiLED is installed.
function assert_ceiled_dir {
  if ! is_ceiled_dir "$1"; then
    fail "$1 is missing some files that should exist in an installation of CeiLED. If your installation is malformed, you may want to reinstall CeiLED."
  fi
}

# Checks if the environment variable $1 is defined in CeiLED's .env file
function is_in_envfile {
  grep -e "^\s*$1=.*" "$CEILED_DIR"/.env &> /dev/null
}

# Checks if the device $1 should be used.
function use_device {
  is_in_envfile "$1"
}

# Prints every supported device.
function list_devices {
  echo "DEV_PCA9685"
}

#-----------------
# docker-compose
#-----------------

# Prints the `-f` arguments to be passed to docker-compose,
# which depends on which devices are specified in the .env
function get_compose_files {
  local files="-f docker-compose.yml"

  if is_in_envfile "DEV_PCA9685"; then
    files="$files -f docker-compose.pca9685.yml"
  fi

  if is_dev; then
    files="$files -f docker-compose.dev.yml"
  fi

  echo "$files"
}
