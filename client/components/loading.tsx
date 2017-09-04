import * as React from 'react';
import styled from 'styled-components';
import { CircularProgress } from 'material-ui/Progress';

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 40px;
`;

interface Props {
  text?: string
}

const Loading = ({ text }: Props) => (
  <LoadingContainer>
    <CircularProgress />
    {text && <p>{text}</p>}
  </LoadingContainer>
);

export default Loading;
