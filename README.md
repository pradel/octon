# octon

<p align="center">
  <img src="client/static/img/logo.png" alt="Octon logo">
</p>

[![Build Status](https://travis-ci.org/pradel/octon.svg?branch=master)](https://travis-ci.org/pradel/octon)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Notifies you when a new release has been made on repositories you starred on Github.

### Features

Emails you when a new release has been made on Github.
- TODO: Daily mail
- TODO: Weekly mail
- Github support
- TODO: Docker support

### Why

I wanted to create an app fully functioning with the latest javascript and to learn how to build a real app with graphql.

### Stack

- [Next.js](https://github.com/zeit/next.js)
- [React](https://facebook.github.io/react)
- [Apollo](http://www.apollostack.com) - Graphql client
- [styled components](https://www.styled-components.com/) - Styling
- [Graphcool](https://www.graph.cool) - Graphql backend

## Contribute

Pull requests are always welcome!

1. `cp .env.default .env` Edit the .env file
2. `cp ./client/config.default.js ./client/config.js` Edit the config file
2. `cp ./project.graphcool.default ./project.graphcool` Edit the config file
2. `yarn` Install nodejs dependencies
3. `yarn dev` Start the app

Before submitting a pull request, please verify that your branch pass the tests with command `yarn test`.

Special thanks to [Quentin Saubadu](https://www.facebook.com/quentinsaubadu) for the logo and design!
