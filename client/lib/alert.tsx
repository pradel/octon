import * as React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      text: '',
      title: '',
    };
    global.octonConfirm = this.showConfirm;
  }

  close = () => this.setState({ isOpen: false });

  confirm = () => {
    this.close();
    this.resolve(true);
  };

  cancel = () => {
    this.close();
    this.resolve(false);
  };

  showConfirm = (title, text) =>
    new Promise((resolve, reject) => {
      this.setState({ isOpen: true, isConfirm: true, text, title });
      this.resolve = resolve;
      this.reject = reject;
    });

  render() {
    const { isOpen, title, text } = this.state;
    return (
      <Dialog open={isOpen} onRequestClose={this.handleRequestClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.confirm} color="accent">
            Confirm
          </Button>
          <Button onClick={this.cancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Alert;
