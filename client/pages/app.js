import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import withData from '../lib/with-data';
import withUser from '../lib/with-user';
import Theme from '../lib/theme';
import Header from '../components/header';
import Loading from '../components/loading';
import ReleasesList from '../components/releases-list';
import ReleaseContent from '../components/release-content';

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

class App extends Component {
  state = { selectedId: null, loadingSync: false };

  componentDidMount() {
    if (!this.props.user) {
      Router.push('/');
    } else if (!this.props.user.lastGithubSyncAt) {
      this.synchronizeUserStars();
    }
  }

  onItemSelect = (id) => {
    this.setState({ selectedId: id });
  };

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
    this.props.refetchReleases();
  };

  render() {
    const { user, loading, releases, loadMoreReleases } = this.props;
    if (!user) return null;
    const { selectedId, loadingSync } = this.state;
    return (
      <Theme>
        <Header user={user} />
        <ColLeft>
          {loading && <Loading />}
          {loadingSync && <Loading text="Your stars are importing please wait a minute..." />}
          {!loading &&
            !loadingSync &&
            <ReleasesList
              releases={releases}
              selectedId={selectedId}
              onItemSelect={this.onItemSelect}
              loadMoreReleases={loadMoreReleases}
            />}
        </ColLeft>
        <ColRight>
          {!loading && selectedId && <ReleaseContent releaseId={selectedId} />}
        </ColRight>
      </Theme>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  releases: PropTypes.array,
  loading: PropTypes.bool,
  refetchReleases: PropTypes.func.isRequired,
  loadMoreReleases: PropTypes.func.isRequired,
};

App.defaultProps = {
  user: null,
  releases: [],
  loading: false,
};

const releasesQuery = gql`
  query allReleases($id: ID, $after: String) {
    allReleases(
      orderBy: publishedAt_DESC
      first: 40
      after: $after
      filter: {
        repository: {
          users_some: {
            id: $id
          }
        }
      }
    ) {
      id
      tagName
      htmlUrl
      publishedAt
      repository {
        avatar
        name
      }
    }
  }
`;

const releasesQueryOptions = {
  props: ({ data: { loading, allReleases, error, refetch, fetchMore } }) => ({
    releases: allReleases,
    refetchReleases: refetch,
    loading,
    error,
    loadMoreReleases() {
      return fetchMore({
        variables: {
          after: allReleases[allReleases.length - 1].id,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            allReleases: [...previousResult.allReleases, ...fetchMoreResult.allReleases],
          });
        },
      });
    },
  }),
  options: ({ user }) => ({
    variables: { id: user && user.id },
    fetchPolicy: 'network-only',
  }),
};

export default compose(withData, withUser(), graphql(releasesQuery, releasesQueryOptions))(App);
