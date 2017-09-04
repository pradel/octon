import * as React from 'react';
import * as PropTypes from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import auth from '../../utils/auth';

const Content = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface State {
  showMore: boolean;
}

class SettingsMore extends React.Component<{}, State> {
  public state = { showMore: false };

  public handleShowMore = () => this.setState({ showMore: true });

  public handleDeleteAccount = async () => {
    const confirm = await octonConfirm(
      'Delete my account',
      'Do you really want to delete your account? (this action is irreversible)'
    );
    if (confirm) {
      // TODO handle error
      await this.props.deleteUser(this.props.user.id);
      auth.unsetToken();
      // TODO clean apollo store
      Router.push('/');
    }
  };

  public render() {
    const { showMore } = this.state;
    return (
      <Content>
        {showMore ? (
          <Button raised color="accent" onClick={this.handleDeleteAccount}>
            Delete my account
          </Button>
        ) : (
          <Button onClick={this.handleShowMore}>More settings</Button>
        )}
      </Content>
    );
  }
}

SettingsMore.propTypes = {
  user: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const updateUserMutation = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const updateUserMutationOptions = {
  props: ({ mutate }) => ({
    deleteUser: id =>
      mutate({
        variables: { id },
      }),
  }),
};

export default graphql(updateUserMutation, updateUserMutationOptions)(
  SettingsMore
);
