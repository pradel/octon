# octon

<p align="center">
  <img src="client/static/img/logo.png" alt="Octon logo">
</p>

[![Build Status](https://travis-ci.org/pradel/octon.svg?branch=master)](https://travis-ci.org/pradel/octon)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Notifies you when a new release has been made on repositories you starred on Github.

## Features

Emails you when a new release has been made on Github.
- Daily mail
- Weekly mail
- Github support
- TODO: Docker support

## Stack

- [Next.js](https://github.com/zeit/next.js)
- [React](https://facebook.github.io/react)
- [Apollo](http://www.apollostack.com) - Graphql client
- [styled components](https://www.styled-components.com/) - Styling
- [Graphcool](https://www.graph.cool) - Graphql backend
- [Auth0](http://auth0.com/) - Auth

## Contribute

Pull requests are always welcome!

In order to run the project you will need to setup [Graphcool](https://www.graph.cool/) and [Auth0](http://auth0.com/).

#### Graphcool setup

You need to apply the following schema to your graphcool project.

```graphql
type User implements Node {
  id: ID! @isUnique
  auth0UserId: String @isUnique
  email: String! @isUnique
  username: String!
  avatar: String!
  lastGithubSyncAt: DateTime
  dailyNotification: Boolean! @defaultValue(value: true)
  weeklyNotification: Boolean! @defaultValue(value: true)
  repositories: [Repository!]! @relation(name: "UserRepositories")
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Repository implements Node {
  id: ID! @isUnique
  name: String!
  avatar: String!
  htmlUrl: String!
  type: String!
  refId: String!
  users: [User!]! @relation(name: "UserRepositories")
  releases: [Release!]! @relation(name: "RepositoryReleases")
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Release implements Node {
  id: ID! @isUnique
  tagName: String!
  htmlUrl: String!
  type: String!
  publishedAt: DateTime!
  refId: String!
  repository: Repository! @relation(name: "RepositoryReleases")
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Auth0 setup

[Connect your app to github](https://auth0.com/docs/connections/social/github).

#### App setup

1. `cp .env.default .env` Edit the .env file
2. `yarn` Install nodejs dependencies
3. `yarn dev` Start the app in dev mode

Before submitting a pull request, please verify that your branch pass the tests with command `yarn test`.

Special thanks to [Quentin Saubadu](https://www.facebook.com/quentinsaubadu) for the logo and design!

## License
MIT © [Léo Pradel](https://github.com/pradel)
