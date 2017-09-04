// tslint:disable-next-line
const fromEvent = require('graphcool-lib').fromEvent;

const clientId = '__GITHUB_CLIENT_ID__';
const clientSecret = '__GITHUB_CLIENT_SECRET__';

async function getGithubToken(code: string): Promise<string> {
  const data = await fetch('https://github.com/login/oauth/access_token', {
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
  });
  const json = await data.json();
  return json.access_token;
}

async function getGithubAccountData(githubToken: string): Promise<any> {
  if (!githubToken) {
    throw new Error('Github access_token is undefined.');
  }

  const data = await fetch(
    `https://api.github.com/user?access_token=${githubToken}`
  );
  const json = await data.json();
  return json;
}

async function getGraphcoolUser(api: any, githubUser: any) {
  const data = await api.request(
    `
   query {
     User(githubUserId: "${githubUser.id}"){
       id
     }
   }`
  );
  if (data.error) {
    throw new Error(data.error);
  }
  return data.User;
}

async function getGithubAccountEmail(githubToken): Promise<string> {
  const data = await fetch(
    `https://api.github.com/user/emails?access_token=${githubToken}`
  );
  const emails = await data.json();
  let email;
  emails.forEach(emailData => {
    if (emailData.primary) {
      email = emailData.email;
    }
  });
  return email;
}

async function createGraphcoolUser(api: any, githubUser: any) {
  // TODO pass arguments as real arguments
  const data = await api.request(
    `
    mutation {
      createUser(
        githubUserId: "${githubUser.id}"
        email: "${githubUser.email}"
        username: "${githubUser.login}"
        avatar: "${githubUser.avatar_url}"
      ) {
        id
      }
    }`
  );
  if (data.error) {
    throw new Error(data.error);
  }
  return data.createUser;
}

module.exports = async event => {
  const code: string = event.data.githubCode;
  const graphcool = fromEvent(event);
  const api = graphcool.api('simple/v1');

  try {
    // Exchange code for a github accessToken
    const accessToken = await getGithubToken(code);
    // Get user with accessToken
    const githubUser = await getGithubAccountData(accessToken);
    // Try to get graphcool user with github user
    let graphcoolUser = await getGraphcoolUser(api, githubUser);
    // If user is not already in db create it
    if (!graphcoolUser) {
      const email = await getGithubAccountEmail(accessToken);
      if (!email) {
        throw new Error('Invalid user email');
      }
      githubUser.email = email;
      graphcoolUser = await createGraphcoolUser(api, githubUser);
    }
    if (!graphcoolUser) {
      throw new Error('Invalid graphcool user');
    }
    // Generate a new token for the user
    const token = await graphcool.generateAuthToken(graphcoolUser.id, 'User');
    // Return a token as a result for the function
    return { data: { token } };
  } catch (error) {
    return { error: error.toString ? error.toString() : error };
  }
};
