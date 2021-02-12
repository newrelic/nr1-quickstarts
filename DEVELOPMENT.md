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
