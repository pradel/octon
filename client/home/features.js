import React from 'react';
import styled from 'styled-components';

const StyledFeatures = styled.div`
  background: #F3F4F8;
  padding: 120px 0;

  & .content {
    width: 600px;
    max-width: 100%;
    margin: 0 auto;
  }

  & .text {
    margin-bottom: 40px;
  }

  & .feature-content {
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: solid 1px #E6E9EA;
  }

  & .feature-content:last-child {
    padding-bottom: 0px;
    border-bottom: none;
  }
`;

const Features = () =>
  (<StyledFeatures>
    <div className="content">
      <h3>Your personal assistant</h3>
      <p className="text">
        Octon is a personal assistant {"that'll"} notify you when new releases have been pushed on
        {' '}
        <b>github</b>
        {' '}
        or
        {' '}
        <b>docker</b>
        . You will be able to view the changelog of a release.
      </p>
      <div className="features-list">
        <div className="feature-content">
          <h5>Multiple sources</h5>
          <p>Github<br />TODO: Docker</p>
        </div>
        <div className="feature-content">
          <h5>Notifications</h5>
          <p>TODO: Daily emails<br />TODO: Weekly emails<br />TODO: Rss feed</p>
        </div>
        <div className="feature-content">
          <h5>Choose what you track</h5>
          <p>
            Simply star a project with your github or docker account and octon will
            automatically notify you of new releases.
          </p>
        </div>
      </div>
    </div>
  </StyledFeatures>);

export default Features;
