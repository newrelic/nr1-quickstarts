# Development Guide

## Dependencies

- NodeJS
- npm
- git

## Running the nerdlet locally

To import dashboards into any account, you can run the nerdlet locally without installing it in New Relic. Run the command below to get it running.

1) Install dependencies: `npm install`
2) Run local webserver: `nr1 nerdpack:serve`

After running the `nr1 nerdpack:serve` command open `https://one.newrelic.com/?nerdpacks=local` in your browser or `https://one.eu.newrelic.com/?nerdpacks=local` if you're in the EU datacenter. You should find `Quickstarts` in your New Relic Apps.

# Advanced

This is only if you want to work on the generator or the website. You don't need to run these commands if you just want to import some dashboards into a New Relic account.

### Generator

1) Open generator directory: `cd website/generator`
2) Building the repository dataset: `./generate-data.sh`

### Website

It's important to first run the generator, as you won't have data to play with if you don't.

1) Open website directory: `cd website`
2) Install dependencies: `npm install`
3) Run local webserver: `npm run start`
