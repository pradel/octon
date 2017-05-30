import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createPalette from 'material-ui/styles/palette';
import createMuiTheme from 'material-ui/styles/theme';
import { blue } from 'material-ui/styles/colors';
import colors from '../utils/colors';

const createDefaultContext = () =>
  MuiThemeProvider.createDefaultContext({
    theme: createMuiTheme({
      palette: createPalette({
        primary: {
          ...blue,
          500: colors.neon,
        },
      }),
    }),
  });

// Singleton hack as there is no way to pass variables from _document.js to pages yet.
let context = null;

export function setDefaultContext() {
  context = createDefaultContext();
}

export function getDefaultContext() {
  // Reuse store on the client-side
  if (!context) {
    context = createDefaultContext();
  }

  return context;
}

export default createDefaultContext;
