import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class SettingsMore extends Component {
  state = { showMore: false };

  handleShowMore = () => this.setState({ showMore: true });

  handleDeleteAccount = async () => {
    const confirm = await octonConfirm(
      'Delete my account',
      'Do you really want to delete your account? (this action is irreversible)',
    );
    if (confirm) {
      // TODO handle error
      await this.props.deleteUser(this.props.user.id);
      auth.unsetToken();
      // TODO clean apollo store
      Router.push('/');
    }
  };

  render() {
    const { showMore } = this.state;
    return (
      <Content>
        {showMore
          ? <Button raised accent onClick={this.handleDeleteAccount}>Delete my account</Button>
          : <Button onClick={this.handleShowMore}>More settings</Button>}
      </Content>
    );
  }
}

SettingsMore.propTypes = {
  user: PropTypes.object.isRequired,
  // deleteUser: PropTypes.func.isRequired,
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

export default graphql(updateUserMutation, updateUserMutationOptions)(SettingsMore);
