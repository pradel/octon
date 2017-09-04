import * as React from 'react';
import * as PropTypes from 'prop-types';
import { MuiThemeProvider } from 'material-ui/styles';
import { getDefaultContext } from '../lib/mui-create-default-context';

class Theme extends React.Component {
  public componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render() {
    const { styleManager, theme } = getDefaultContext();
    const { children } = this.props;
    return (
      <MuiThemeProvider styleManager={styleManager} theme={theme}>
        <div>{children}</div>
      </MuiThemeProvider>
    );
  }
}

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Theme;
