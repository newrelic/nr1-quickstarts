#!/usr/bin/env bash

echo "Checking branch"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo "You are not on the main branch, stopping here";
  echo "Run 'git checkout main' to fix this"
  exit 1;
fi
echo

echo "Checking if node is installed"
if ! command -v node &> /dev/null
then
    echo "node could not be found"
    echo "follow the instructions here to install: https://nodejs.dev/learn/how-to-install-nodejs"
    exit
fi
echo

echo "Checking if the nr1 CLI is installed"
if ! command -v nr1 &> /dev/null
then
    echo "nr1 CLI could not be found"
    echo "follow the instructions here to install: https://one.newrelic.com/launcher/developer-center.launcher?pane=eyJuZXJkbGV0SWQiOiJkZXZlbG9wZXItY2VudGVyLmRldmVsb3Blci1jZW50ZXIifQ=="
    exit
fi
echo

echo "Updating nr1 CLI to latest version"
nr1 update
echo

echo "Pulling latest version of quickstarts nerdlet"
git pull origin main
echo

echo "Updating dependencies"
npm install
echo

echo "Running the nerdlet command"
echo "Press CTRL + C to close after you're finished importing dashboards"
npm run start
