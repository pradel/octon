import * as React from 'react';
import * as PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withData from '../lib/with-data';
import withUser from '../lib/with-user';
import AppLayout from '../components/app-layout';
import SettingsNotifications from '../components/settings/notifications';
import SettingsEmail from '../components/settings/email';
import Rss from '../components/settings/rss';
import SettingsMore from '../components/settings/more-settings';

const Settings = ({ user }) => (
  <AppLayout>
    <SettingsNotifications user={user} />
    <SettingsEmail user={user} />
    <Rss user={user} />
    <SettingsMore user={user} />
  </AppLayout>
);

Settings.propTypes = {
  user: PropTypes.object.isRequired,
};

export default compose(withData, withUser())(Settings);
