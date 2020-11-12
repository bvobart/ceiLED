# Commands to manage authentication

function auth_help {
  cli_name=${0##*/}
  echo "CeiLED CLI - version $(get_version) - Command: auth

Usage: $cli_name [--debug] [--dir DIR] auth COMMAND

Options:
  --debug               Use CeiLED with the debug driver instead of the actual driver.
  --dir DIR             Apply the commands to the CeiLED installation in DIR. 
                        Useful if you have multiple installations of CeiLED.

Commands:
  add NAME TOKEN        Add an authorisation token to the authorisation database. 
                        Use this if you want to allow another user (or yourself) to control CeiLED.
  list                  List all authorised devices and their authorisation tokens
  remove NAME|TOKEN     Removes an authorisation token from the DB, either by name or by token.
  *                     Prints this help
"
}

function auth_add {
  # TODO: implement adding user to auth DB
  echo "not implemented"
}

function auth_list {
  # TODO: implement listing all known auth entries
  echo "not implemented"
}

function auth_remove {
  # TODO: implement removing an auth token
  echo "not implemented"
}

function auth {
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