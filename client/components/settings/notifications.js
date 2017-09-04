import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import List, {
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';

class SettingsNotifications extends Component {
  handleChangeNotification = (e, a) => {
    const params = {
      dailyNotification: this.props.user.dailyNotification,
      weeklyNotification: this.props.user.weeklyNotification,
    };
    params[e.target.name] = a;
    this.props.updateUser(this.props.user.id, params);
    // TODO handle error
  };

  render() {
    const { user } = this.props;
    return (
      <List subheader={<ListSubheader>Notifications</ListSubheader>}>
        <ListItem>
          <ListItemText primary="Daily notifications" />
          <ListItemSecondaryAction>
            <Switch
              name="dailyNotification"
              checked={user.dailyNotification}
              onChange={this.handleChangeNotification}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Weekly notifications" />
          <ListItemSecondaryAction>
            <Switch
              name="weeklyNotification"
              checked={user.weeklyNotification}
              onChange={this.handleChangeNotification}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
}

SettingsNotifications.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const updateUserMutation = gql`
  mutation updateUser(
    $id: ID!
    $dailyNotification: Boolean!
    $weeklyNotification: Boolean!
  ) {
    updateUser(
      id: $id
      dailyNotification: $dailyNotification
      weeklyNotification: $weeklyNotification
    ) {
      id
      dailyNotification
      weeklyNotification
    }
  }
`;

const updateUserMutationOptions = {
  props: ({ mutate }) => ({
    updateUser: (id, { dailyNotification, weeklyNotification }) =>
      mutate({
        variables: { id, dailyNotification, weeklyNotification },
        optimisticResponse: {
          __typename: 'Mutation',
          updateUser: {
            __typename: 'User',
            id,
            dailyNotification,
            weeklyNotification,
          },
        },
      }),
  }),
};

export default graphql(updateUserMutation, updateUserMutationOptions)(
  SettingsNotifications
);
