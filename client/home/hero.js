import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledHero = styled.div`
  min-height: 750px;
  background: url(/static/img/landing/hero.jpg) center center;
  background-size: cover;
  position: relative;
  color: white;

  & .content {
    padding-top: 23%;
    text-align: center;
  }

  & .title {
    margin-bottom: 40px;
    font-size: 60px;
  }

  & .intro {
    color: #fff;
    font-size: 20px;
    font-weight: 300;
    margin-bottom: 80px;
  }

  & .btn {
    font-size: 13px;
    padding: 15px 40px;
    color: #ffffff !important;
    border: solid 2px #1fe8af;
    border-radius: 40px;
    display: inline-block;
    text-transform: uppercase;
    background-color: #1fe8af;
  }
`;

const Hero = ({ handleLogin }) => (
  <StyledHero>
    <div className="content">
      <h1 className="title">Octon will keep you posted !</h1>
      <p className="intro">
        Any new releases on your starred projects ? Octon will let you know.
      </p>
      <button className="btn" onClick={handleLogin}>
        Log in with github
      </button>
    </div>
  </StyledHero>
);

Hero.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default Hero;
