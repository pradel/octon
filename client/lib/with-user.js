import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default (props = {}) => (ComposedComponent) => {
  class WithUser extends Component {
    static propTypes = {
      loading: PropTypes.bool,
      user: PropTypes.object,
    };

    static defaultProps = {
      loading: false,
      user: null,
    };

    render() {
      // TODO handle error
      const { loading, ...rest } = this.props;
      if (loading) {
        return <div>Laoding user data ...</div>;
      }
      return <ComposedComponent {...rest} />;
    }
  }

  const userQuery = props.query
    ? gql(props.query)
    : gql`
    query {
      user {
        id
        username
        email
        avatar
        lastGithubSyncAt
      }
    }
  `;

  const userQueryOptions = {
    props: ({ data: { loading, user, error } }) => ({
      user,
      loading,
      error,
    }),
  };

  return graphql(userQuery, userQueryOptions)(WithUser);
};
