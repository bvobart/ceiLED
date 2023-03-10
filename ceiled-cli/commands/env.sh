# Launches the editor on the .env file used by docker-compose.
# Creates a new one from the sample .env file if it doesn't exist yet.
function env {
  cd "$CEILED_DIR" || return
  [[ -d .env ]] && fail "$CEILED_DIR/.env is a directory, please remove it."
  [[ -f .env ]] || cp .env.sample .env
  [[ -z "$EDITOR" ]] && fail "No default editor set. Please set the EDITOR environment variable, or manually edit $CEILED_DIR/.env with your favourite text editor."
  $EDITOR .env
}
