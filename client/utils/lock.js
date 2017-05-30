class Lock {
  constructor() {
    // eslint-disable-next-line no-undef
    this.lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_CLIENT_DOMAIN);
  }

  login() {
    this.lock.show();
  }

  getLock() {
    return this.lock;
  }
}

export default Lock;
