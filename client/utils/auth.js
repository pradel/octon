export const auth0IdTokenKey = 'auth0IdToken';

export default {
  setToken(token) {
    if (process.browser) {
      window.localStorage.setItem(auth0IdTokenKey, token);
    }
  },

  getToken() {
    return process.browser
      ? window.localStorage.getItem(auth0IdTokenKey)
      : undefined;
  },

  unsetToken() {
    if (process.browser) {
      window.localStorage.removeItem(auth0IdTokenKey);
    }
  },
};
