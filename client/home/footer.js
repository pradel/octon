import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  & .separator {
    height: 60px;
    background-color: #495061
  }

  & .footer {
    background-color: #3D4351;
    padding: 120px 0 120px 0;
    text-align: center;
  }

  & .social p {
    color: #fff;
  }

  & .info {
    color: #ACB1B4;
    font-size: 13px;
  }
`;

const Footer = () => (
  <StyledFooter>
    <div className="separator" />
    <div className="footer">
      <div className="social">
        <p>
          Share Octon with your friends:{' '}
          <a href="https://twitter.com/OctonApp" className="twitter-share">Twitter</a>
        </p>
      </div>
      <p className="info">
        Copyright © 2017 Octon<br />
        <a href="https://github.com/pradel/octon/blob/master/LICENSE">Licence</a>
        {' '}
        | Theme crafted
        {' '}
        by
        {' '}
        <a href="http://www.peterfinlan.com/">Peter Finlan</a>
        .
      </p>
    </div>
  </StyledFooter>
);

export default Footer;
