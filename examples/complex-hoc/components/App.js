import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PermissionProvider } from 'user-permissions';
import Hoc from './Hoc';
import { fetchComments } from '../reducers/commentReducer';

function mapStateToProps(state) {
  return {
    data: state.data,
  };
}
const mapDispatchToProps = {
  fetchComments,
};

class App extends Component {
  static get propTypes() {
    return {
      data: PropTypes.array,
      fetchComments: PropTypes.func,
    };
  }

  constructor() {
    super();
    this.state = {
      isHocToggle: true,
    };
  }

  componentDidMount() {
    this._asyncRequest = this.props.fetchComments({ functionCode: 'functionCode1' });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    return (
      <div>
        Complex - Hoc
        <button onClick={() => this.setState({ isHocToggle: !this.state.isHocToggle })}>
          {`${this.state.isHocToggle ? 'hide' : 'show'} Hoc`}
        </button>
        {this.state.isHocToggle && <div><Hoc /></div>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
