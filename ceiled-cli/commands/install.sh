# Copies CeiLED's files to the target directory $1
function copy_ceiled_files {
  cp -r $CEILED_DIR/ceiled-cli "$1/ceiled-cli/"
  cp $CEILED_DIR/.env.sample "$1"
  cp $CEILED_DIR/docker-compose.yml "$1"
  cp $CEILED_DIR/docker-compose.debug.yml "$1"
  cp $CEILED_DIR/ReadMe.md "$1"
}

# Installs CeiLED in the folder given as $1
function install {
  local target_dir=$(readlink -f "$1") # get absolute path
  [[ ! -e "$1" ]] && mkdir -p "$1"
  [[ ! -d "$1" ]] && fail "Target folder is not a directory: $1"

  echo "--> Copying CeiLED files..."
  copy_ceiled_files $target_dir

  echo "--> Adding CeiLED CLI to system-wide PATH (/etc/profile), I will need sudo for this."
  local profile_target='/etc/profile.d/ceiled.sh'
  local export_cmd="export PATH=$target_dir/ceiled-cli:\$PATH"
  echo "$export_cmd" | sudo tee $profile_target > /dev/null 
  sudo chmod +x $profile_target
  export PATH=$target_dir/ceiled-cli:$PATH

  echo "--> Downloading Docker images..."
  ceiled update
  
  echo "--> Done!"
  echo ""
  echo "> CeiLED is now installed at $target_dir"
  echo "> The 'ceiled' command-line tool has also been installed and added to your system-wide PATH"
  echo ">"
  echo "> However, your system-wide path is only read at startup, so if you want"
  echo "> to use 'ceiled' now, run the following command:"
  echo "--> $export_cmd"
  echo ""
  echo "> Light up your life! Run this command to start CeiLED: "
  echo "--> ceiled start"
  echo ""
  echo "> You'll probably want to set up your runtime environment variables first, using:"
  echo "--> ceiled env"
  echo ""
}

# Perhaps add a cron job to check for updates automatically every now and then?
