import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { copy } from 'clipboard-js';
import List, {
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ContentCopy from 'material-ui-icons/ContentCopy';

class Rss extends Component {
  handleCopyRss = () => {
    copy(`${process.env.BASE_URL}/users/${this.props.user.id}/rss`);
    // TODO show Snackbar text copied
  };

  render() {
    const { user } = this.props;
    return (
      <List subheader={<ListSubheader>Rss</ListSubheader>}>
        <ListItem>
          <ListItemText
            primary={`${process.env.BASE_URL}/users/${user.id}/rss`}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={this.handleCopyRss} title="Copy to clipboard">
              <ContentCopy />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
}

Rss.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Rss;
