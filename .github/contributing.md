# Contributing

Hi! :wave: I'm exited that you are interested in contributing to this project. Below are some information that might help you get started.

## Prerequisites
* A recent version of [Node.js](https://nodejs.org/en/).

## Setup
After cloning the repository, run:
```bash
npm ci # install the dependencies of the project
```
Overview of tools used:
* [TypeScript](https://www.typescriptlang.org/) as the programming language.
* [Jest](https://jestjs.io/en/) for unit testing.
* [Prettier](https://prettier.io/) for code formatting.

## Scripts
### `npm run build`
Compiles the package code under `<root>/main` into a folder called `dist`.

### `npm run test`
Runs all test suits, see [Jest CLI Options](https://jestjs.io/docs/en/cli) for more options.

### `npm run dev`
Starts a local development server with an example site. This is the perfect place to play around, it uses [vite](https://github.com/vitejs/vite) as the build tool.

## Project Structure
* The code of the package lies in the folder `<root>/main`.
* Unit tests are located alongside the code,  inside directories named `__tests__`. Test files all have the ending `.spec.ts`.
* Under `<root>/src` is where you will find the Vue code for the example site.
