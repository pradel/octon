import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
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

const ReleasesList = ({ releases, selectedId, onItemSelect, loadMoreReleases }) =>
  (<List>
    {releases.length === 0 && <StyledNoReleases>No recent releases</StyledNoReleases>}
    {releases.map(release =>
      (<ReleasesListItem
        key={release.id}
        release={release}
        active={release.id === selectedId}
        onClick={onItemSelect}
      />),
    )}
    {releases.length > 0 &&
      <StyledLoadMore>
        <Button raised onClick={loadMoreReleases}>Load more</Button>
      </StyledLoadMore>}
  </List>);

ReleasesList.propTypes = {
  releases: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  onItemSelect: PropTypes.func.isRequired,
  loadMoreReleases: PropTypes.func.isRequired,
};

ReleasesList.defaultProps = {
  selectedId: null,
};

export default ReleasesList;
