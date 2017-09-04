import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import find from 'lodash/find';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import marked from 'marked';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import TimeAgo from 'timeago-react';
import Loading from './loading';

const Content = styled.div`padding: 0 16px;`;

const StyledListItem = styled(ListItem)`cursor: pointer;`;

const StyledTitle = styled(Typography)`
  margin-top: 10px !important;
  margin-bottom: 20px !important;
`;

class ReleaseContent extends Component {
  state = { changelog: null };

  componentWillReceiveProps(nextProps) {
    if (nextProps.release) {
      if (!this.props.release || this.props.release.refId !== nextProps.release.refId) {
        this.loadReleaseInfo(nextProps.release);
      }
    }
  }

  handleOpenNewTabRepository = () => {
    window.open(this.props.release.repository.htmlUrl, '_blank');
  };

  loadReleaseInfo = async (release) => {
    this.setState({ changelog: null });
    const url = `https://api.github.com/repos/${release.repository.name}/releases`;
    let data = await fetch(url);
    data = await data.json();
    if (data && data.length > 0) {
      const changelog = find(data, elem => elem.tag_name === release.tagName);
      if (changelog && changelog.body) {
        this.setState({ changelog: marked(changelog.body) });
      }
    }
  };

  render() {
    // TODO 404
    const { release, loading } = this.props;
    const { changelog } = this.state;
    return (
      <div>
        {loading && <Loading />}
        {!loading &&
        release && (
          <div>
            <Head>
              <title>
                {release.tagName} - {release.repository.name} - Octon
              </title>
              <meta
                property="og:title"
                content={`${release.tagName} - ${release.repository.name} - Octon`}
              />
              <meta
                property="og:description"
                content={`Release ${release.tagName} - ${release.repository.name}`}
              />
              <meta property="og:type" content="website" />
              <meta property="og:image" content={release.repository.avatar} />
            </Head>
            <List>
              <StyledListItem onClick={this.handleOpenNewTabRepository}>
                <Avatar alt={release.repository.name} src={release.repository.avatar} />
                <ListItemText
                  primary={release.repository.name}
                  secondary={
                    <Typography color="secondary" component="span">
                      Released this <TimeAgo datetime={new Date(release.publishedAt)} />
                    </Typography>
                  }
                />
              </StyledListItem>
            </List>
            <Content>
              <StyledTitle type="title" component="a" href={release.htmlUrl} target="_blank">
                {release.tagName}
              </StyledTitle>
              {!changelog && (
                <Typography type="caption">There is no changelog for this release</Typography>
              )}
              {changelog && (
                <Typography
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: changelog }}
                />
              )}
            </Content>
          </div>
        )}
      </div>
    );
  }
}

ReleaseContent.propTypes = {
  release: PropTypes.object,
  loading: PropTypes.bool,
};

ReleaseContent.defaultProps = {
  release: null,
  loading: false,
};

const releaseQuery = gql`
  query allReleases($repositoryType: String!, $repositoryName: String!, $releaseTagName: String!) {
    allReleases(
      filter: {
        tagName: $releaseTagName
        repository: { name: $repositoryName, type: $repositoryType }
      }
    ) {
      id
      refId
      tagName
      htmlUrl
      publishedAt
      repository {
        id
        avatar
        name
        htmlUrl
      }
    }
  }
`;

const releaseQueryOptions = {
  props: ({ data: { loading, allReleases, error } }) => ({
    release: allReleases && allReleases[0],
    loading,
    error,
  }),
  options: ({ repositoryType, repositoryName, releaseTagName }) => ({
    variables: { repositoryType, repositoryName, releaseTagName },
  }),
};

export default graphql(releaseQuery, releaseQueryOptions)(ReleaseContent);
