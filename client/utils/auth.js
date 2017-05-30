import Cookie from 'js-cookie';

export const auth0IdTokenKey = 'auth0IdToken';

export default {
  setToken(token) {
    if (process.browser) {
      Cookie.set(auth0IdTokenKey, token);
    }
  },

  getToken(ctx) {
    if (process.browser) {
      return Cookie.get(auth0IdTokenKey);
    }
    return ctx.req.cookies[auth0IdTokenKey];
  },

  unsetToken() {
    if (process.browser) {
      Cookie.remove(auth0IdTokenKey);
    }
  },
};
