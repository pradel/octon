import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { CircularProgress } from 'material-ui/Progress';

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const Loading = ({ text }) => (
  <LoadingContainer>
    <CircularProgress />
    {text && <p>{text}</p>}
  </LoadingContainer>
);

Loading.propTypes = {
  text: PropTypes.string,
};

Loading.defaultProps = {
  text: null,
};

export default Loading;
