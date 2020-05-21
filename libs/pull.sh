#!/bin/bash
# PULL ALL LIBRARIES

function pull {
    echo "----- pull $1 -----"
    cd $PWD/$1
    git pull
    cd ..
}

for dir in */
do
  pull ${dir%*/}
done
