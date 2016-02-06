import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { submitForm } from '../../../../ducks/sections/admin/Roles';
class AddRole extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const { showModal, closeModal, fields: { name, description }, handleSubmit } =  this.props;

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
            <Modal.Title>Add Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input { ...errors(name) } type="text" label="Name" placeholder="Enter name" { ...name } />
            <Input { ...errors(description) } type="text" label="Description" placeholder="Enter description" { ...description } />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ closeModal }>Close</Button>
            <Button bsStyle="success" type="submit">Create Role</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

AddRole.propTypes = {
  openModal: React.PropTypes.bool,
  closeModal: React.PropTypes.func
};
AddRole.defaultProps = { };

export default reduxForm(
  {
    form: 'addrole-form',
    fields: ['name', 'description']
  },
  state => state.Role
)(AddRole);
