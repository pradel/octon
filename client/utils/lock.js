// eslint-disable-next-line
import config from '../config';

class Lock {
  constructor() {
    // eslint-disable-next-line no-undef
    this.lock = new Auth0Lock(config.auth0ClientId, config.auth0Domain);
  }

  login() {
    this.lock.show();
  }

  getLock() {
    return this.lock;
  }
}

export default Lock;
