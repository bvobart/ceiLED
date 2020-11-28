# Depends on:
# - ../utils.sh

export TESTS_PASSED="true"

function run_test {
  local test="$@"
  let "tests_total+=1"

  if $test; then
    print_green "passed - $test"
    let "tests_passed+=1"
  else
    print_red "failed - $test"
  fi
}

function test_suite {
  local suite="$@"
  local tests_total=$((0))
  local tests_passed=$((0))

  print_yellow "--- Suite: $suite ---"
  $suite

  local tests_failed=$((tests_total - tests_passed))
  local tests_passed_str=$(print_green "Passed: $tests_passed/$tests_total")
  local tests_failed_str=$(print_red "Failed: $tests_failed/$tests_total")

  local postfix=$(print_yellow "- $suite ---\n")
  if [ $tests_failed -gt 0 ]; then
    export TESTS_PASSED="false"
    print_yellow "--- $tests_failed_str - $tests_passed_str $postfix"
  else
    print_yellow "--- $tests_passed_str $postfix"
  fi
}

function test_end {
  if [[ $TESTS_PASSED != "true" ]]; then
    print_red "--- TESTS FAILED ---"
    exit 1
  else
    print_green "--- TESTS PASSED ---"
    exit 0
  fi
}

# Runs all arguments that it gets and negates the exit code.
# i.e. 'not true' will return a non-zero exit code
# while 'not false' will return an exit code of zero
function not {
  $@ && false || true
}

# Expects that the command under test prints / returns something
# Usage:
# run_test returns "this is a sentence" --- echo "this is a sentence" 
function returns {
  local test_expectation="$1"
  shift
  until [[ "$1" == "---" ]]; do
    test_expectation="$test_expectation $1"
    shift
  done
  shift

  local test_actual_output="$($@)"
  [[ "$test_actual_output" == "$test_expectation" ]] 
}