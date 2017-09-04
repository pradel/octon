import * as React from 'react';
import * as PropTypes from 'prop-types';
import Router from 'next/router';
import styled from 'styled-components';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVert from 'material-ui-icons/MoreVert';
import auth from '../utils/auth';
import colors from '../utils/colors';

const StyledAppBar = styled(AppBar)`
  background-color: #1c1d1c !important;
  box-shadow: none !important;
`;

const StyledLogoContainer = styled.div`flex: 1;`;

const StyledLogo = styled.img`height: 25px;`;

const StyledAvatar = styled.div`
  height: 40px;
  width: 40px;
  background-size: cover;
  background-position: center;
  display: block;
  border-radius: 50%;
  margin-top: 5px;
  border: 1px solid #1fe8af;
`;

interface Props {
  user: any
}

interface State {
  menuOpen: boolean
  menuAnchorEl: any
}

class Header extends React.Component<Props, State> {
  public state = {
    menuOpen: false,
    menuAnchorEl: null,
  };

  public handleToggleMenu = event =>
    this.setState({
      menuOpen: !this.state.menuOpen,
      menuAnchorEl: event && event.currentTarget,
    });

    public handleSettings = () => {
    Router.push('/settings');
  };

  public handleLogout = () => {
    auth.unsetToken();
    Router.push('/');
  };

  public render() {
    const { user } = this.props;
    const { menuAnchorEl, menuOpen } = this.state;
    return (
      <StyledAppBar>
        <Toolbar>
          <StyledLogoContainer>
            <StyledLogo alt="Octon logo" src="/static/img/logo.svg" />
          </StyledLogoContainer>
          <StyledAvatar style={{ backgroundImage: `url(${user.avatar})` }} />
          <IconButton
            onClick={this.handleToggleMenu}
            style={{ color: colors.neon }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onRequestClose={this.handleToggleMenu}
          >
            <MenuItem onClick={this.handleSettings}>Settings</MenuItem>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>
    );
  }
}

export default Header;
