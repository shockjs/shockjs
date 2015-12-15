import React, {Component} from 'react';
import {connect} from 'react-redux';

class Welcome extends Component {
  render() {
    return (
        <h1>Howdy Stranger</h1>
    );
  }
}

export default connect(state => state.Welcome)(Welcome)
