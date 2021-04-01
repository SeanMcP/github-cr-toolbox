# Contributing

## Setup

The development environment requires Node.js/npm.

1. Checkout this repository
2. Install dependencies: `npm ci`
3. Run in watch mode: `npm run dev`

## How to add to browser while developing

### Chrome

1. Go to [`chrome://extensions`]
2. Enable "Developer mode"
3. Select "Load unpacked"
4. Select the project directory / `manifest.json`

### Firefox

1. Go to [`about:debugging#/runtime/this-firefox`]
2. Select "Load Temporary Add-on..."
3. Select the project directory / `manifest.json`
