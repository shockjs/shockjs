import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { fetchPermissionTypes, submitForm } from '../../../../blocks/sections/admin/modals/assign.auth.child.block';

class AssignAuthChildComponent extends Component
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
    const { showModal, closeModal, authTypes, handleSubmit, fields: { authTypeID } } =  this.props;

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

AssignAuthChildComponent.propTypes = {
  openModal: React.PropTypes.bool,
  closeModal: React.PropTypes.func
};
AssignAuthChildComponent.defaultProps = { };

export default reduxForm(
  {
    form: 'assign-auth-form',
    fields: ['authTypeID']
  },
  state => state.AssignAuthChild
)(AssignAuthChildComponent);
