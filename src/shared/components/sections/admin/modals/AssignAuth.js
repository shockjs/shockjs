import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { fetchPermissionTypes, submitForm } from '../../../../ducks/sections/admin/modals/AssignAuth';

class AssignAuth extends Component
{

  fetchAuthTypes(event)
  {
    const { dispatch } = this.props;
    dispatch(fetchPermissionTypes(event.target.value));
  }

  submitForm(values, dispatch)
  {
    submitForm({
      authTypeID: values.authTypeID,
      userID: this.props.userID
    }, dispatch);
  }

  /**
   * Render the component.
   */
  render()
  {
    const { showModal, closeModal, authTypes, handleSubmit, fields: { authTypeID, type } } =  this.props;

    const errors = (element) => {
      return {
        bsStyle: element.error ? 'error' : null,
        help: element.error
      };
    };

    return (
      <Modal show={ showModal } onHide={ closeModal }>
        <form onSubmit={ handleSubmit((values, dispatch) => this.submitForm(values, dispatch)) }>
          <Modal.Header closeButton>
            <Modal.Title>Assign Permission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input type="select" label="Select Permission Type" { ...type } onChange={ (event) => this.fetchAuthTypes(event) }>
              <option value="" />
              <option value="1">Role</option>
              <option value="2">Operation</option>
            </Input>
            { authTypes ?
              <Input { ...errors(authTypeID) } type="select" label="Select Permission" { ...authTypeID }>
                <option value="" />
                { authTypes.map((authType) =>
                  <option key={ authType.id } value={ authType.id }>{ authType.label }</option>
                ) }
              </Input> : ''
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ closeModal }>Close</Button>
            <Button bsStyle="success" type="submit">Assign</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

AssignAuth.propTypes = {
  openModal: React.PropTypes.bool,
  closeModal: React.PropTypes.func
};
AssignAuth.defaultProps = { };

export default reduxForm(
  {
    form: 'assign-auth-form',
    fields: ['authTypeID', 'type']
  },
  state => state.AssignAuth
)(AssignAuth);
