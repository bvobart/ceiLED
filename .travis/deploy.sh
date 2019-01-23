#!/bin/bash

# print outputs and exit on first failure
set -xe

if [ $TRAVIS_BRANCH == "master" ] || [ $TRAVIS_BRANCH == "develop" ] ; then

    # setup ssh agent, git config and remote
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/travis_key
    git remote add deploy "travis@bart.vanoort.is:/var/www/ceiled.bart.vanoort.is"
    git config user.name "Travis CI"
    git config user.email "travis@bart.vanoort.is"

    # commit built files and push to remote
    rm -f .gitignore
    cp .travis/deployignore .gitignore
    git add .
    git status # debug
    git commit -m "Deploy built files"

    if [ $TRAVIS_BRANCH == "master" ] ; then
        git push -f deploy HEAD:master
    else
        git push -f deploy HEAD:develop
    fi

else

    echo "No deploy script for branch '$TRAVIS_BRANCH'"

fi
