import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRoles, renderServer, cleanupServer } from '../../../ducks/Roles';
import { ListView, GridView, Pagination, GridColumn } from 'react-list-combo';

class Roles extends Component
{

  static renderServer()
  {
    return renderServer();
  }

  componentDidMount()
  {
    const { dispatch, renderedServer } = this.props;
    if (renderedServer === false) {
      dispatch(fetchRoles());
    }
  }

  componentWillUnmount()
  {
    const { dispatch } = this.props;
    dispatch(cleanupServer());
  }

  fetchMore(page)
  {
    const { dispatch } = this.props;
    return dispatch(fetchRoles(page));
  }

  render()
  {

    // If we are loading server side and no prefetching is done of data.
    if (this.props.roles === false) {
      return false;
    }

    return (
      <div>
        <div className="page-header">
          <h1>Roles</h1>
        </div>
        <ListView initData={ this.props.roles } dataSource={ this.fetchMore.bind(this) }>
          <GridView tableClassName="table table-bordered table-response table-hover table-condensed">
            <GridColumn header="Name" name="name" />
            <GridColumn header="Description" name="description" />
          </GridView>
          <Pagination />
        </ListView>
      </div>
    )
  }
}


Roles.componentID = 'Roles';

export default connect(state => state.Roles)(Roles);