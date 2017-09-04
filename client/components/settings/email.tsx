import * as React from 'react';
import * as PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import List, {
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Edit from 'material-ui-icons/Edit';
import Save from 'material-ui-icons/Save';

const Form = styled.form`
  display: flex;
  padding: 0 16px;
`;

const StyledTextField = styled(TextField)`width: 100%;`;

interface State {
  editEmail: boolean;
  email: string;
}

class SettingsEmail extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      editEmail: false,
      email: user.email,
    };
  }

  public handleChangeUserEmail = e => {
    e.preventDefault();
    const { email } = this.state;
    if (this.props.user.email !== email) {
      this.props.updateUser(this.props.user.id, email);
    }
    this.setState({ editEmail: false });
    // TODO handle error
  };

  public handleChangeEmail = event =>
    this.setState({ email: event.target.value });
  public handleEditEmail = () =>
    this.setState({ editEmail: !this.state.editEmail });

  public render() {
    const { user } = this.props;
    const { editEmail, email } = this.state;

    return (
      <div>
        <List subheader={<ListSubheader>Email</ListSubheader>}>
          {!editEmail ? (
            <ListItem>
              <ListItemText primary={user.email} />
              <ListItemSecondaryAction>
                <IconButton onClick={this.handleEditEmail} title="Edit">
                  <Edit />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ) : null}
        </List>
        {editEmail ? (
          <Form onSubmit={this.handleChangeUserEmail}>
            <StyledTextField
              id="Email"
              placeholder="Email"
              value={email}
              onChange={this.handleChangeEmail}
            />
            <IconButton type="submit" title="Save">
              <Save />
            </IconButton>
          </Form>
        ) : null}
      </div>
    );
  }
}

SettingsEmail.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const updateUserMutation = gql`
  mutation updateUser($id: ID!, $email: String!) {
    updateUser(id: $id, email: $email) {
      id
      email
    }
  }
`;

const updateUserMutationOptions = {
  props: ({ mutate }) => ({
    updateUser: (id, email) =>
      mutate({
        variables: { id, email },
        optimisticResponse: {
          __typename: 'Mutation',
          updateUser: {
            __typename: 'User',
            id,
            email,
          },
        },
      }),
  }),
};

export default graphql(updateUserMutation, updateUserMutationOptions)(
  SettingsEmail
);
