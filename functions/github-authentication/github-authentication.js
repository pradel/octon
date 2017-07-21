// eslint-disable-next-line
const fromEvent = require('graphcool-lib').fromEvent;

const clientId = '__CLIENT_ID__';
const clientSecret = '__CLIENT_SECRET__';

module.exports = function GithubAuthentification(event) {
  const code = event.data.githubCode;
  const graphcool = fromEvent(event);
  const api = graphcool.api('simple/v1');

  function getGithubToken() {
    return fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })
      .then(data => data.json())
      .then(json => json.access_token);
  }

  function getGithubAccountData(githubToken) {
    if (!githubToken) {
      return Promise.reject('Github access_token is undefined.');
    }

    return fetch(`https://api.github.com/user?access_token=${githubToken}`)
      .then(response => response.json())
      .then((parsedResponse) => {
        console.log(parsedResponse);
        if (parsedResponse.error) {
          return Promise.reject(parsedResponse.error.message);
        }
        return parsedResponse;
      });
  }

  function getGraphcoolUser(githubUser) {
    return api
      .request(
        `
    query {
      User(githubUserId: "${githubUser.id}"){
        id
      }
    }`,
      )
      .then((userQueryResult) => {
        if (userQueryResult.error) {
          return Promise.reject(userQueryResult.error);
        }
        return userQueryResult.User;
      });
  }

  function createGraphcoolUser(githubUser) {
    return api
      .request(
        `
      mutation {
        createUser(
          githubUserId:"${githubUser.id}"
        ){
          id
        }
      }`,
      )
      .then(userMutationResult => userMutationResult.createUser.id);
  }

  function generateGraphcoolToken(graphcoolUserId) {
    return graphcool.generateAuthToken(graphcoolUserId, 'User');
  }

  return getGithubToken().then(githubToken =>
    getGithubAccountData(githubToken)
      .then(githubUser =>
        getGraphcoolUser(githubUser).then((graphcoolUser) => {
          if (graphcoolUser === null) {
            return createGraphcoolUser(githubUser);
          }
          return graphcoolUser.id;
        }),
      )
      .then(generateGraphcoolToken)
      .then(token =>
        ({ data: { token } }.catch((err) => {
          err.toString();
        })),
      ),
  );
};
