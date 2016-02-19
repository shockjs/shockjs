import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import BootstrapPasswordStrength from 'bootstrap-react-password-strength';
import { submitForm } from '../../../../ducks/sections/admin/Users';
class AddUserComponent extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const { showModal, closeModal, fields: { firstName, lastName, password, confirmPassword, username, email }, handleSubmit } =  this.props;

    const errors = (element) => {
      return {
        bsStyle: element.error ? 'error' : null,
        help: element.error
      };
    };

    return (
      <Modal show={ showModal } onHide={ closeModal }>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input { ...errors(firstName) } type="text" label="First name" placeholder="Enter first name" { ...firstName } />
            <Input { ...errors(lastName) } type="text" label="Last name" placeholder="Enter last name" { ...lastName } />
            <Input { ...errors(email) } type="text" label="Email" placeholder="Enter email so we can contact you." { ...email } />
            <Input { ...errors(username) } type="text" label="Username" placeholder="Enter username for easy login." { ...username } />
            <BootstrapPasswordStrength { ...errors(password) } placeholder="Enter password for privacy." { ...password } />
            <Input { ...errors(confirmPassword) }type="password" label="Confirm password" placeholder="Confirm password for correctness" { ...confirmPassword } />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ closeModal }>Close</Button>
            <Button bsStyle="success" type="submit">Create User</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

AddUserComponent.propTypes = {
  openModal: React.PropTypes.bool,
  closeModal: React.PropTypes.func
};
AddUserComponent.defaultProps = { };

export default reduxForm(
  {
    form: 'adduser-form',
    fields: ['firstName', 'lastName', 'password', 'confirmPassword', 'username', 'email']
  },
  state => state.User
)(AddUserComponent);
