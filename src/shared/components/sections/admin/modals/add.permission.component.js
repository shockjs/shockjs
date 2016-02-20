import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { submitForm } from '../../../../blocks/sections/admin/permissions.block';
class AddPermissionComponent extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const { showModal, closeModal, fields: { name, description, label, type }, handleSubmit } =  this.props;

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
            <Modal.Title>Add Permission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input { ...errors(label) } type="text" label="Label" placeholder="Label" { ...label } />
            <Input { ...errors(type) } type="select" label="Type" { ...type } >
              <option value="" />
              <option value="1">Role</option>
              <option value="2">Operation</option>
            </Input>
            <Input { ...errors(name) } type="text" label="Name" placeholder="Enter name" { ...name } />
            <Input { ...errors(description) } type="text" label="Description" placeholder="Enter description" { ...description } />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ closeModal }>Close</Button>
            <Button bsStyle="success" type="submit">Create Permission</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

AddPermissionComponent.propTypes = {
  openModal: React.PropTypes.bool,
  closeModal: React.PropTypes.func
};
AddPermissionComponent.defaultProps = { };

export default reduxForm(
  {
    form: 'add-permission-form',
    fields: ['name', 'description', 'label', 'type']
  },
  state => state.Permissions
)(AddPermissionComponent);
