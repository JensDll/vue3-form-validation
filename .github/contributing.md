# Contributing

Hi! :wave: I'm exited that you are interested in contributing to this project. Below are some information that might help you get started.

## Prerequisites

- You will need [Node.js](https://nodejs.org/en/) **version 12.9+** for `Promise.allSettled` to work.

## Setup

After cloning the repository, run:

```bash
npm install # install the dependencies of the project
```

Overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the programming language.
- [Jest](https://jestjs.io/en/) for unit testing.
- [Prettier](https://prettier.io/) for code formatting.

## Scripts

### `npm run build`

Compiles the package code under `<root>/main` into a folder called `dist`.

### `npm run test`

Run all [jest](https://jestjs.io/) test suits, see [Jest CLI Options](https://jestjs.io/docs/en/cli) for more options.

### `npm run test-dts`

Run tests for type definitions using [tsd](https://github.com/SamVerschueren/tsd). The project has to be built first before running this.
Type tests are located in the folder `<root>/main/test-dts`.

### `npm run test-all`

Run both [jest](https://jestjs.io/) and [tsd](https://github.com/SamVerschueren/tsd) tests.

### `npm run dev`

Starts a local development server with an example site. It uses [vite](https://github.com/vitejs/vite) as the build tool.

## Project Structure

- The code of the package lies in the folder `<root>/main`.
- Unit tests are located alongside the code, inside directories named `__tests__`. Test files have the ending `.spec.ts`.
- Under `<root>/vite` is where you will find the Vue code for the example site.
