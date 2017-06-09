import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import compose from 'recompose/compose';
import styled from 'styled-components';
import { CircularProgress } from 'material-ui/Progress';
import withData from '../lib/with-data';
import Lock from '../utils/lock';
import auth from '../utils/auth';
import Theme from '../lib/theme';

const StyledLoading = styled.div`
  min-height: 100vh;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class CreateUser extends Component {
  componentDidMount() {
    if (!auth.getToken()) {
      Router.push('/');
      return;
    }
    this.lock = new Lock();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      // If user is already logged redirect him
      if (nextProps.user) {
        Router.push('/app');
      } else {
        // Else create a new one
        this.createUser();
      }
    }
  }

  createUser = () => {
    const token = auth.getToken();
    this.lock.getLock().getProfile(token, async (err, data) => {
      if (err) {
        // TODO handle err
        return;
      }
      try {
        const variables = {
          idToken: auth.getToken(),
          email: data.email,
          username: data.nickname,
          avatar: data.picture,
        };
        await this.props.createUser({ variables });
        // Invalidate user query cache
        await this.props.refetchUser();
        Router.push('/app');
      } catch (e) {
        // TODO print error
        console.error(e);
      }
    });
  };

  render() {
    // TODO display error
    return (
      <Theme>
        <StyledLoading>
          <CircularProgress />
        </StyledLoading>
      </Theme>
    );
  }
}

CreateUser.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object,
  createUser: PropTypes.func.isRequired,
  refetchUser: PropTypes.func.isRequired,
};

CreateUser.defaultProps = {
  loading: true,
  user: null,
};

const userQuery = gql`
  query {
    user {
      id
    }
  }
`;

const userQueryOptions = {
  props: ({ data: { loading, user, error, refetch } }) => ({
    user,
    loading,
    error,
    refetchUser: refetch,
  }),
  options: () => ({
    fetchPolicy: 'network-only',
  }),
};

const createUserMutation = gql`
  mutation ($idToken: String!, $username: String!, $email: String!, $avatar: String!) {
    createUser(authProvider: { auth0: { idToken: $idToken } }, username: $username, email: $email, avatar: $avatar) {
      id
    }
  }
`;

export default compose(
  withData,
  graphql(userQuery, userQueryOptions),
  graphql(createUserMutation, { name: 'createUser' }),
)(CreateUser);
