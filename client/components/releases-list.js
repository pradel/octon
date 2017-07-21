import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Loading from './loading';
import ReleasesListItem from './releases-list-item';

const StyledNoReleases = styled(Typography)`
  text-align: center;
  margin-top: 40px !important;
`;

const StyledLoadMore = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const ReleasesList = ({ releases, loading, loadMoreReleases }) =>
  (<List>
    {loading && <Loading />}
    {!loading && releases.length === 0 && <StyledNoReleases>No recent releases</StyledNoReleases>}
    {releases.map(release => <ReleasesListItem key={release.id} release={release} />)}
    {releases.length > 0 &&
      <StyledLoadMore>
        <Button raised onClick={loadMoreReleases}>
          Load more
        </Button>
      </StyledLoadMore>}
  </List>);

ReleasesList.propTypes = {
  loading: PropTypes.bool,
  releases: PropTypes.array,
  loadMoreReleases: PropTypes.func.isRequired,
};

ReleasesList.defaultProps = {
  releases: [],
  loading: false,
};

const releasesQuery = gql`
  query allReleases($id: ID, $after: String) {
    allReleases(
      orderBy: publishedAt_DESC
      first: 40
      after: $after
      filter: { repository: { users_some: { id: $id } } }
    ) {
      id
      tagName
      htmlUrl
      publishedAt
      repository {
        id
        avatar
        name
        type
      }
    }
  }
`;

const releasesQueryOptions = {
  props: ({ data: { loading, allReleases, error, fetchMore } }) => ({
    releases: allReleases,
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
    variables: { id: user.id },
    // Poll the list each 30 minutes
    pollInterval: 30 * 60 * 1000,
  }),
};

export default graphql(releasesQuery, releasesQueryOptions)(ReleasesList);
