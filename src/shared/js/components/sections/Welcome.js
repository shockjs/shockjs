import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers, renderServer } from '../../actions/UserListActions'

class Welcome extends Component {
  static renderServer() {
    return renderServer();
  }

  componentDidMount()
  {
    const { dispatch, renderedServer } = this.props;
    if (renderedServer === false) {
      dispatch(fetchUsers());
    }
  }

  render() {
    return (
        <h1>Howdy Stranger</h1>
    );
  }
}

export default connect(state => state.Welcome)(Welcome)
