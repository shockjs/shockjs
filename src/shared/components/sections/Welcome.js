/**
 * @file Welcome section component
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers, renderServer } from '../../actions/UserListActions'

class Welcome extends Component
{
  static componentID = 'Welcome'; // Easy way to identify our component.

  /**
   * Prerender our user list.
   */
  static renderServer()
  {
    return renderServer();
  }

  /**
   * If this routes was initiated on the client, fetch our user list.
   */
  componentDidMount()
  {
    const { dispatch, renderedServer } = this.props;
    if (renderedServer === false) {
      dispatch(fetchUsers());
    }
  }

  /**
   * Render our component.
   */
  render()
  {
    return (
        <h1>Howdy Stranger</h1>
    );
  }
}

export default connect((state) => {
  return {
    app: state.App,
    welcome: state.Welcome
  }
})(Welcome)
