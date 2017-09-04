import * as React from 'react';
import compose from 'recompose/compose';
import withData from '../lib/with-data';
import AppLayout from '../components/app-layout';

const App = () => <AppLayout />;

export default compose(withData)(App);
