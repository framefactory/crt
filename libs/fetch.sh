#!/bin/bash
# FETCH ALL LIBRARIES AND CHECKOUT MASTER

function fetch {
    echo "----- fetch/master $1 -----"
    cd $PWD/$1
    git fetch && git checkout master
    cd ..
}

for dir in */
do
  fetch ${dir%*/}
done
