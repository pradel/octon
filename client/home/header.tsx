import * as React from 'react';
import styled from 'styled-components';
import * as PropTypes from 'prop-types';

const StyledHeader = styled.header`
  position: fixed;
  width: 100%;
  z-index: 999;
  background-color: #232731;

  & header {
    position: relative;
    width: 1170px;
    max-width: 100%;
    margin: 0 auto;
    padding: 35px 0;
  }

  & header .logo {
    display: inline-block;
  }

  & header .action {
    float: right;
    display: inline-block;
  }

  & header button {
    padding: 8px 40px;
    font-size: 13px;
    border: solid 2px;
    border-radius: 40px;
    display: inline-block;
    border-color: #fff;
    color: #fff;
    background-color: transparent;
  }
`;

const Header = ({ handleLogin }) => (
  <StyledHeader>
    <header>
      <div className="logo">
        <img alt="Octon logo" src="/static/img/logo.svg" height="36" />
      </div>
      <div className="action">
        <button onClick={handleLogin}>SIGN UP</button>
      </div>
    </header>
  </StyledHeader>
);

Header.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default Header;
