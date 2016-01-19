import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import BootstrapPasswordStrength from 'bootstrap-react-password-strength';
import Error from '../../../form/Error';
import { submitForm } from '../../../../ducks/Users';
class AddUser extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const { showModal, closeModal, fields: { firstName, lastName, password, confirmPassword, username, email }, handleSubmit } =  this.props;
    return (
      <Modal show={ showModal } onHide={ closeModal }>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input type="text" label="First name" placeholder="Enter first name" { ...firstName } />
            <Error element={ firstName } />
            <Input type="text" label="Last name" placeholder="Enter last name" { ...lastName } />
            <Error element={ lastName } />
            <BootstrapPasswordStrength { ...password } placeholder="Enter password for privacy." />
            <Error element={ password } />
            <Input type="password" label="Confirm password" placeholder="Confirm password for correctness" { ...confirmPassword } />
            <Error element={ confirmPassword } />
            <Input type="text" label="Username" placeholder="Enter username for easy login." { ...username } />
            <Error element={ username } />
            <Input type="text" label="Email" placeholder="Enter email so we can contact you." { ...email } />
            <Error element={ email } />
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

AddUser.propTypes = {
  openModal: React.PropTypes.bool,
  closeModal: React.PropTypes.func
};
AddUser.defaultProps = { };

export default reduxForm(
  {
    form: 'adduser-form',
    fields: ['firstName', 'lastName', 'password', 'confirmPassword', 'username', 'email']
  },
  state => state.User
)(AddUser);
