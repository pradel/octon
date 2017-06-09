import React, { Component } from 'react';
import Router from 'next/router';
import { injectGlobal } from 'styled-components';
import Lock from '../utils/lock';
import auth from '../utils/auth';
import withData from '../lib/with-data';
import Header from '../home/header';
import Hero from '../home/hero';
import Features from '../home/features';
import SignUp from '../home/sign-up';
import Footer from '../home/footer';

// eslint-disable-next-line
injectGlobal`
  h3 {
    margin: 0 0 20px 0;
    font-size: 24px;
    color: #3D4351;
  }

  h5 {
    font-size: 15px;
    color: #3D4351;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  p {
    color: rgba(28, 54, 83, 0.6);
    font-size: 15px;
    line-height: 29px;
  }

  .btn {
    font-size: 13px;
    padding: 15px 40px;
    color: #ffffff !important;
    border: solid 2px #1fe8af;
    border-radius: 40px;
    display: inline-block;
    text-transform: uppercase;
    background-color: #1fe8af;
  }
`;

class Index extends Component {
  componentDidMount() {
    this.lock = new Lock();
    this.lock.getLock().on('authenticated', (authResult) => {
      auth.setToken(authResult.idToken);
      Router.push('/create-user');
    });
  }

  handleLogin = () => {
    this.lock.login();
  };

  render() {
    return (
      <div>
        <Header handleLogin={this.handleLogin} />
        <Hero handleLogin={this.handleLogin} />
        <Features />
        <SignUp handleLogin={this.handleLogin} />
        <Footer />
      </div>
    );
  }
}

export default withData(Index);
