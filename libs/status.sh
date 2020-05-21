#!/bin/bash
# CHECK STATUS OF ALL LIBRARIES

function status {
    echo "----- status $1 -----"
    cd $PWD/$1
    git status -s -b
    cd ..
}

for dir in */
do
  status ${dir%*/}
done
