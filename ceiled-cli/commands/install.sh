# Prepares the targeted installation folder $1 by initialising a sparse Git repo in it
# such that updates can be downloaded using `git fetch`
# If $2 is given, this is assumed to be the Git ref to checkout, e.g. 'develop'.
function prepare_target_folder {
  local target_dir="$1"
  local target_ref="$2"
  [[ -z "$target_ref" ]] && target_ref="master"

  cd "$target_dir" || return
  git init
  git config advice.detachedHead false
  git config core.sparseCheckout true
  git remote add origin https://github.com/bvobart/ceiLED.git
  echo_ceiled_files > .git/info/sparse-checkout
  git fetch --depth 1 origin "$target_ref"
  git checkout "$target_ref"
}

# Installs CeiLED in the folder given as $1
function install {
  local target_dir=$(get_path "$1")
  local target_ref="$2"
  [[ ! -e "$1" ]] && mkdir -p "$1"
  [[ ! -d "$1" ]] && fail "Target folder is not a directory: $1"
  [[ -d "$1/.git" ]] && fail "There is already a Git repository in $1, please remove it first, or install CeiLED to a different folder"

  print_green "--> Installing CeiLED to $target_dir"
  [[ -n "$target_ref" ]] && print_green "> Using Git branch / ref: $target_ref"
  print_yellow "--> Preparing target folder..."
  prepare_target_folder "$target_dir" "$target_ref"

  print_yellow "--> Copying CeiLED files..."
  copy_ceiled_files "$target_dir"

  local profile_target='/etc/profile.d/ceiled.sh'
  local export_cmd="export PATH=$target_dir/ceiled-cli:\$PATH"

  print_yellow "--> If you want, I can add CeiLED CLI to your system-wide PATH ($profile_target)"
  print_yellow "--> so every user on this machine can use it, but I will need sudo for this."
  read -p "Do you want me to that? (y/n)" -n 1 -r
  echo
  added_to_path="false"
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "$export_cmd" | sudo tee $profile_target > /dev/null 
    sudo chmod +x $profile_target
    added_to_path="true"
  fi

  # if we're installing a different ref of CeiLED, we should specify this ref as a Docker image tag.
  if [[ -n "$target_ref" ]]; then
    echo "DOCKER_TAG=$target_ref" >> "$target_dir"/.env
    cat "$CEILED_DIR"/.env.sample >> "$target_dir"/.env
  fi

  # Running `ceiled update`, which prints Done! at the end
  bash "$target_dir"/ceiled-cli/ceiled update
  
  print_green ""
  print_green "> CeiLED is now installed at $target_dir"
  print_green "> The 'ceiled' command-line tool has also been installed at $target_dir/ceiled-cli/ceiled"
  [[ $added_to_path == "true" ]] && print_green "> and has also been added to your system-wide PATH."
  print_green ">"
  if [[ $added_to_path == "true" ]]; then
    print_green "> However, your system-wide path is only read at startup, so if you want"
    print_green "> to use 'ceiled' now, run the following command:"
  else 
    print_green "> To use 'ceiled' now, run the following command in your terminal."
    print_green "> Additionally, persist it in your ~/.bashrc or ~/.zshrc or fish_config or whatever your shell uses."
  fi
  echo "--> $export_cmd"
  print_green ""
  print_green "> Light up your life! Run this command to start CeiLED: "
  echo "--> ceiled start"
  print_green ""
  print_green "> You'll probably want to set up your runtime environment variables first, using:"
  echo "--> ceiled env"
  print_green ""
}

# Perhaps add a cron job to check for updates automatically every now and then?
