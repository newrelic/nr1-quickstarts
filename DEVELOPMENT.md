# Development Guide


## Dependencies

- NodeJS
- npm
- git

## Run locally

### Generator

1) Open generator directory: `cd website/generator`
2) Building the repository dataset: `./generate-data.sh`

### Nerdlet

1) Install dependencies: `npm install`
2) Run local webserver: `nr1 nerdpack:serve`

### Website

It's important to first run the generator, as you won't have data to play with if you don't.

1) Open website directory: `cd website`
2) Install dependencies: `npm install`
3) Run local webserver: `npm run start`
