# Copies CeiLED's files to the target directory $1
function copy_ceiled_files {
  cp -r $CEILED_DIR/ceiled-cli "$1/ceiled-cli/"
  cp $CEILED_DIR/.env.sample "$1"
  cp $CEILED_DIR/docker-compose.yml "$1"
  cp $CEILED_DIR/docker-compose.debug.yml "$1"
  cp $CEILED_DIR/ReadMe.md "$1"
}

# Prints the relative paths of the installed files and directories relative to $CEILED_DIR
# preceded by a / because it's meant to be thrown into .git/info/sparse_checkout
function echo_ceiled_files {
  echo "/ceiled-cli"
  echo "/.env.sample"
  echo "/docker-compose.yml"
  echo "/docker-compose.debug.yml"
  echo "/ReadMe.md"
}

# Prepares the targeted installation folder by initialising a sparse Git repo in it
# such that updates can be downloaded using `git fetch`
function prepare_target_folder {
  cd $target_dir
  git init
  git config advice.detachedHead false
  git config core.sparseCheckout true
  git remote add origin https://github.com/bvobart/ceiLED.git
  echo_ceiled_files > .git/info/sparse-checkout
  git fetch --depth 1 origin master
  git checkout master
}

# Installs CeiLED in the folder given as $1
function install {
  local target_dir=$(get_path "$1")
  [[ ! -e "$1" ]] && mkdir -p "$1"
  [[ ! -d "$1" ]] && fail "Target folder is not a directory: $1"
  [[ -d "$1/.git" ]] && fail "There is already a Git repository in $1, please remove it first, or install CeiLED to a different folder"

  local profile_target='/etc/profile.d/ceiled.sh'
  local export_cmd="export PATH=$target_dir/ceiled-cli:\$PATH"

  print_yellow "--> Installing CeiLED to $target_dir"
  print_yellow "--> Preparing target folder..."
  prepare_target_folder $target_dir

  print_yellow "--> Copying CeiLED files..."
  copy_ceiled_files $target_dir

  print_yellow "--> Adding CeiLED CLI to system-wide PATH (/etc/profile), I will need sudo for this."
  echo "$export_cmd" | sudo tee $profile_target > /dev/null 
  sudo chmod +x $profile_target

  # Running `ceiled update`, which prints Done! at the end
  bash $target_dir/ceiled-cli/ceiled update
  
  print_green ""
  print_green "> CeiLED is now installed at $target_dir"
  print_green "> The 'ceiled' command-line tool has also been installed and added to your system-wide PATH"
  print_green ">"
  print_green "> However, your system-wide path is only read at startup, so if you want"
  print_green "> to use 'ceiled' now, run the following command:"
  print_green "--> $export_cmd"
  print_green ""
  print_green "> Light up your life! Run this command to start CeiLED: "
  print_green "--> ceiled start"
  print_green ""
  print_green "> You'll probably want to set up your runtime environment variables first, using:"
  print_green "--> ceiled env"
  print_green ""
}

# Perhaps add a cron job to check for updates automatically every now and then?
