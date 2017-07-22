import React, { Component } from 'react';
import Router from 'next/router';
import { injectGlobal } from 'styled-components';
import { request } from 'graphql-request';
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
  async componentDidMount() {
    const githubCode = window.location.search.substring(1).split('&')[0].split('code=')[1];
    if (githubCode) {
      // TODO show loading during login
      // Remove hash in url
      window.history.replaceState({}, document.title, '.');
      // Try to login user
      try {
        const data = await request(process.env.GRAPHCOOL_URL, `
          mutation {
            authenticateGithubUser(githubCode: "${githubCode}") {
              token
            }
          }
        `);
        auth.setToken(data.authenticateGithubUser.token);
        Router.push('/app');
      } catch (err) {
        if (err.response.errors[0].functionError) {
          alert(err.response.errors[0].functionError);
        } else {
          alert(err.response.errors[0].message);
        }
      }
    }
  }

  handleLogin = () => {
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${process.env
        .GITHUB_CLIENT_ID}&scope=user:email`,
    );
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
