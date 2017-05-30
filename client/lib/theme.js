import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue } from 'material-ui/styles/colors';
import createPalette from 'material-ui/styles/palette';
import colors from '../utils/colors';

const theme = createMuiTheme({
  palette: createPalette({
    primary: {
      ...blue,
      500: colors.neon,
    },
  }),
});

const Theme = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <div>
      {children}
    </div>
  </MuiThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Theme;
