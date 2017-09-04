import * as React from 'react';
import * as PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withData from '../lib/with-data';
import AppLayout from '../components/app-layout';
import ReleaseContent from '../components/release-content';

const Release = ({ url }) => (
  <AppLayout>
    <ReleaseContent
      repositoryType={url.query.repositoryType}
      repositoryName={url.query.repositoryName}
      releaseTagName={url.query.releaseTagName}
    />
  </AppLayout>
);

Release.propTypes = {
  url: PropTypes.object.isRequired,
};

export default compose(withData)(Release);
