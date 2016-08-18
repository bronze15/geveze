#/usr/bin/env bash

# http://stackoverflow.com/a/2658301/1766716
# __g ()  {
#   [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] && echo "*"
# }

# __g

[[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] && echo "*"
