import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import marked from 'marked';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import TimeAgo from 'timeago-react';
import Loading from './loading';

const Content = styled.div`
  padding: 0 16px;
`;

const StyledListItem = styled(ListItem)`
  cursor: pointer;
`;

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
    data = data[0];
    if (data && data.tag_name === release.tagName) {
      this.setState({ changelog: data.body });
    }
  };

  render() {
    const { release, loading } = this.props;
    const { changelog } = this.state;
    return (
      <div>
        {loading && <Loading />}
        {!loading &&
          release &&
          <div>
            <List>
              <StyledListItem onClick={this.handleOpenNewTabRepository}>
                <Avatar alt={release.repository.name} src={release.repository.avatar} />
                <ListItemText
                  primary={release.repository.name}
                  secondary={
                    <Typography secondary>
                      Released this
                      {' '}
                      <TimeAgo datetime={new Date(release.publishedAt)} />
                    </Typography>
                  }
                />
              </StyledListItem>
            </List>
            <Content>
              <StyledTitle type="title" component="a" href={release.htmlUrl} target="_blank">
                {release.tagName}
              </StyledTitle>
              {!changelog &&
                <Typography type="caption">There is no changelog for this release</Typography>}
              {changelog &&
                <Typography
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: marked(changelog) }}
                />}
            </Content>
          </div>}
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
  query Release($id: ID) {
    Release(id: $id) {
      id
      refId
      tagName
      htmlUrl
      publishedAt
      repository {
        avatar
        name
        htmlUrl
      }
    }
  }
`;

const releaseQueryOptions = {
  props: ({ data: { loading, Release, error } }) => ({
    release: Release,
    loading,
    error,
  }),
  options: ({ releaseId }) => ({
    variables: { id: releaseId },
  }),
};

export default graphql(releaseQuery, releaseQueryOptions)(ReleaseContent);
