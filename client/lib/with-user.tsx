import * as React from 'react';
import * as PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default (props = {}) => ComposedComponent => {
  class WithUser extends React.Component {
    public static propTypes = {
      loading: PropTypes.bool,
      user: PropTypes.object,
    };

    public static defaultProps = {
      loading: false,
      user: null,
    };

    public render() {
      // TODO handle error
      // TODO nice loading
      const { loading, ...rest } = this.props;
      if (loading) {
        return <div>Loading user data ...</div>;
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
            dailyNotification
            weeklyNotification
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
