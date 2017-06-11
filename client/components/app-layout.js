import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Router from 'next/router';
import styled from 'styled-components';
import withUser from '../lib/with-user';
import Theme from '../lib/theme';
import Alert from '../lib/alert';
import Header from '../components/header';
import Loading from '../components/loading';
import ReleasesList from '../components/releases-list';

const ColLeft = styled.div`
  margin-top: 64px;
  width: 35%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
`;

const ColRight = styled.div`
  margin-top: 64px;
  position: fixed;
  left: 35%;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #eaeaea;
  overflow: auto;
  padding: 0 39px;
  padding-bottom: 40px;
`;

class AppLayout extends Component {
  state = { loadingSync: false };

  componentDidMount() {
    if (!this.props.user) {
      Router.push('/');
    } else if (!this.props.user.lastGithubSyncAt) {
      this.synchronizeUserStars();
    }
  }

  synchronizeUserStars = async () => {
    this.setState({ loadingSync: true });
    const data = await fetch('/api/sync-stars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.props.user.id,
      }),
    });
    await data.json();
    // TODO display error
    this.setState({ loadingSync: false });
  };

  render() {
    const { user, children } = this.props;
    if (!user) return null;
    const { loadingSync } = this.state;
    return (
      <Theme>
        <Alert />
        <Header user={user} />
        <ColLeft>
          {loadingSync && <Loading text="Your stars are importing please wait a minute..." />}
          {!loadingSync && <ReleasesList user={user} />}
        </ColLeft>
        <ColRight>
          {children}
        </ColRight>
      </Theme>
    );
  }
}

AppLayout.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};

AppLayout.defaultProps = {
  user: null,
  children: null,
};

export default compose(withUser())(AppLayout);
