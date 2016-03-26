import React, { Component } from 'react';
import { Button, Modal, Input, ProgressBar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { fetchPermissionTypes, submitForm } from '../../../../components/sections/admin/modals/assign.auth.child.block';

class AssignAuthChildComponent extends Component
{

  componentWillMount()
  {
    const { dispatch } = this.props;
    dispatch(fetchPermissionTypes(2));
  }

  fetchAuthTypes(event)
  {
    const { dispatch } = this.props;
    dispatch(fetchPermissionTypes(event.target.value));
  }

  submitForm(values, dispatch)
  {
    submitForm({
      child: values.child,
      parent: this.props.permID
    }, dispatch);
  }

  /**
   * Render the component.
   */
  render()
  {
    const { showModal, closeModal, authTypes, handleSubmit, fields: { child } } =  this.props;

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
            <Modal.Title>Assign Child Permission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { authTypes && authTypes.length > 0 ?
              <Input { ...errors(child) } type="select" label="Select Permission" { ...child }>
                <option value="" />
                { authTypes.map((authType) =>
                  <option key={ authType.id } value={ authType.id }>{ authType.label }</option>
                ) }
              </Input> : ''
            }
            { authTypes && authTypes.length === 0 && <div>There are currently no operations to assign.</div> }
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
    fields: ['child']
  },
  state => state.AssignAuthChild
)(AssignAuthChildComponent);
