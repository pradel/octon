import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import classnames from 'classnames';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { ListItem, ListItemText } from 'material-ui/List';
import TimeAgo from 'timeago-react';

const StyledListItem = styled(ListItem)`
  transition: background-color 0.5s linear;
  cursor: pointer;

  &.active {
    background-color: #eaeaea;
  }
`;

const StyledLink = styled.a`
  font-weight: bold;
`;

class ReleasesListItem extends Component {
  handleClick = () => {
    this.props.onClick(this.props.release.id);
  };

  render() {
    const { release, active } = this.props;
    return (
      <StyledListItem
        button
        className={classnames({ active })}
        onClick={this.handleClick}
      >
        <Avatar alt={release.repository.name} src={release.repository.avatar} />
        <ListItemText
          primary={release.repository.name}
          secondary={
            <Typography secondary>
              Released
              {' '}
              <StyledLink
                className="version"
                href={release.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {release.tagName}
              </StyledLink>
              {' • '}
              <TimeAgo datetime={new Date(release.publishedAt)} />
            </Typography>
          }
        />
      </StyledListItem>
    );
  }
}

ReleasesListItem.propTypes = {
  release: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default onlyUpdateForKeys(['release', 'active'])(ReleasesListItem);
