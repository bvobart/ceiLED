# Commands to manage authentication

function auth_help {
  cli_name=${0##*/}
  echo "CeiLED CLI - version $(get_version) - Command: auth

Usage: $cli_name [--dir DIR] [--dev] auth COMMAND

Options:
  --dir DIR             Apply the commands to the CeiLED installation in DIR. 
                        Useful if you have multiple installations of CeiLED.
  --dev                 Build CeiLED from source. Must be used from within the original Git repository.

Commands:
  add NAME TOKEN        Add an authorisation token to the authorisation database. 
                        Use this if you want to allow another user (or yourself) to control CeiLED.
  list                  List all authorised devices and their authorisation tokens
  remove NAME|TOKEN     Removes an authorisation token from the DB, either by name or by token.
  *                     Prints this help
"
}

function auth_add {
  local name="$1"
  local token="$2"
  
  local server_container=$(docker-compose ps -q server)
  local mongo_container=$(docker-compose ps -q mongodb)

  [[ -z "$server_container" ]] && fail "ceiled-server must be running to add users to the authorisation database"
  [[ -z "$mongo_container" ]] && fail "CeiLED's MongoDB container must be running to add users to the authorisation database"

  docker-compose exec server node scripts/auth/add.js "$name" "$token"
}

function auth_list {
  local server_container=$(docker-compose ps -q server)
  local mongo_container=$(docker-compose ps -q mongodb)

  [[ -z "$server_container" ]] && fail "ceiled-server must be running to list the contents of the authorisation database"
  [[ -z "$mongo_container" ]] && fail "CeiLED's MongoDB container must be running to list the contents of the authorisation database"

  docker-compose exec server node scripts/auth/list.js
}

function auth_remove {
  local args=( "$@" )
  local server_container=$(docker-compose ps -q server)
  local mongo_container=$(docker-compose ps -q mongodb)

  [[ -z "$server_container" ]] && fail "ceiled-server must be running to remove a user from the authorisation database"
  [[ -z "$mongo_container" ]] && fail "CeiLED's MongoDB container must be running to remove a user from the authorisation database"

  docker-compose exec server node scripts/auth/remove.js "${args[@]}"
}

function auth {
  cd "$CEILED_DIR" || return
  while true; do
    case "$1" in
      add)
        shift
        auth_add "$@"
        exit
        ;;
      list)
        shift
        auth_list "$@"
        exit
        ;;
      remove)
        shift
        auth_remove "$@"
        exit
        ;;
      *)
        is_help "$1" || print_red "Error: unknown sub-command for auth: $1\n"
        auth_help
        exit 1
        ;;
    esac
  done
}
