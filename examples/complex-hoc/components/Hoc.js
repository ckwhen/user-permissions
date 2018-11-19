import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withPermission, Can } from 'user-permissions';

const permissionConfig = {
  permission: 'HocPage',
  functionCodes: [
    {
      functionCode: 'functionCode1',
      actionCode: 'actionCode1',
    },
    {
      functionCode: 'functionCode2',
      actionCode: ['actionCode1', 'actionCode3'],
    }
  ],
};

class Hoc extends Component {
  static get propTypes() {
    return {
      children: PropTypes.node,
    };
  }

  componentDidMount() {
    const {
      permission: {
        functionCodes,
        actionCodes,
        permissionFailRedirector,
      },
    } = this.props;
    permissionFailRedirector(functionCodes.functionCode1, actionCodes.actionCode1, 'http://www.yahoo.com.tw');
  }

  render() {
    const {
      permission: {
        functionCodes,
        actionCodes,
      },
    } = this.props;
    return (
      <div>
        I'm HOC
        <Can
          run={actionCodes.actionCode1}
          on={functionCodes.functionCode2}
          render={() => <div>allowed content</div>}
        />
      </div>
    );
  }
}

export default withPermission(permissionConfig)(Hoc);
