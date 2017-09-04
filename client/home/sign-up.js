import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledSignUp = styled.div`
  background: #fff;
  padding: 120px 0;
  text-align: center;
`;

const SignUp = ({ handleLogin }) => (
  <StyledSignUp>
    <div className="content">
      <h3>Octon is absolutely free, wanna get started ?</h3>
      <p>
        Octon is an <a href="https://github.com/pradel/octon">
          open source
        </a>{' '}
        project
      </p>
      <button className="btn" onClick={handleLogin}>
        Log in with github
      </button>
    </div>
  </StyledSignUp>
);

SignUp.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default SignUp;
