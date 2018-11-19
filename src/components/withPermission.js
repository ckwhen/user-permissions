import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  omit,
  isArray,
} from 'lodash';
import { connect } from 'react-redux';
import {
  error,
  toArray,
  getFnCode,
  getActionCode,
  isContainArray,
  validatePermissionReducer,
  validateFunctionCode,
  validatePermission,
  validatePropNamespace,
  validateActionCode,
} from '../utils';
import {
  initialize,
  destory,
  fetchUserPermissions,
} from '../reducers';

const omitPropNames = [
  'permission',
  'permissions',
  'methodCode',
  'functionCode',
  'actionCode',
  'functionCodes',
  'actionCodes',
  'redirectUrl',
  'urlRedirector',
  'propNamespace',
  'isInitialized',
  'initialize',
  'destory',
  'fetchUserPermissions',
];

const mapStateToProps = (state, props) => {
  validatePermissionReducer(state.permission);
  return state.permission[props.permission] || {};
};
const mapDispatchToProps = {
  initialize,
  destory,
  fetchUserPermissions,
};

const defaultConfig = {
  // 設定permission名稱
  permission: undefined,
  // 設定目前模組,提供給getUserPermissions作為query參數
  methodCode: undefined,
  // 設定允許功能,提供給getUserPermissions作為query參數
  functionCode: undefined,
  // 設定允許動作
  actionCode: undefined,
  // 設定允許多筆功能
  // [
  //   {
  //     functionCode,
  //     actionCode,
  //   }
  // ]
  functionCodes: undefined,
  // 注入到component的prop名稱
  propNamespace: undefined,
};

const withPermission = (initialConfig = {}) => {
  const config = Object.assign({}, defaultConfig, initialConfig);

  return (WrappedComponent) => {
    class WithPermission extends Component {
      static get propTypes() {
        return {
          isInitialized: PropTypes.bool,
          propNamespace: PropTypes.string,
          methodCode: PropTypes.string,
          functionCode: PropTypes.string,
          permission: PropTypes.string,
          actionCodes: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
          ]),
          functionCodes: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
          ]),
          permissions: PropTypes.arrayOf(PropTypes.shape({
            moduleCode: PropTypes.string,
            functionCode: PropTypes.string,
            actionCode: PropTypes.string,
          })).isRequired,
          initialize: PropTypes.func,
          destory: PropTypes.func,
          fetchUserPermissions: PropTypes.func,
        };
      }
      static get childContextTypes() {
        return {
          _userPermissions: PropTypes.shape({
            permissionFailRedirector: PropTypes.func,
            isActionAllowed: PropTypes.func,
            isActionDenied: PropTypes.func,
          }),
        };
      }
      static validator({
        permission,
        functionCode,
        actionCode,
        functionCodes,
        propNamespace,
      } = {}) {
        validatePermission(permission);
        validatePropNamespace(propNamespace);
        if (
          !functionCode
          && (!functionCodes || !isArray(functionCodes))
        ) {
          error('Missing parameter. FunctionCode or functionCodes is required');
        } else if (functionCode && typeof functionCode !== 'string') {
          error('FunctionCode must be a string. If you want to allow multiple permissions. Use functionCodes');
        } else if (functionCodes && !isArray(functionCodes)) {
          error('FunctionCodes must be an array');
        }
        validateActionCode(actionCode);
        // validate functionCodes
        if (functionCodes) {
          functionCodes.forEach((item) => {
            if (!item.functionCode) {
              error('Missing parameter. FunctionCode is required');
            }
            if (typeof item.functionCode !== 'string') {
              error('FunctionCode must be a string');
            }
            validateActionCode(item.actionCode);
          });
        }
      }

      constructor() {
        super();
        [
          'getPermissions',
          'getPassedPermissions',
          'isActionAllowed',
          'isActionDenied',
          'permissionFailRedirector',
        ].forEach((fn) => { this[fn] = this[fn].bind(this); });
      }

      getChildContext() {
        return {
          _userPermissions: {
            permissionFailRedirector: this.permissionFailRedirector,
            isActionAllowed: this.isActionAllowed,
            isActionDenied: this.isActionDenied,
          },
        };
      }

      componentDidMount() {
        // 驗證來源config
        WithPermission.validator(config);
        // 初始化config
        this.props.initialize(config);
        // 取得權限資料
        const { methodCode, functionCode, permission } = this.props;
        this.fetchPromise = this.props.fetchUserPermissions(permission, {
          methodCode,
          functionCode,
        });
      }

      componentWillUnmount() {
        if (this.fetchPromise) {
          delete this.fetchPromise;
        }

        this.props.destory(this.props.permission);
      }

      getPermissions() {
        return this.props.permissions || [];
      }

      getPassedPermissions(functionCode, actionCode) {
        const permissions = this.getPermissions();
        const functionCodes = toArray(functionCode);
        let passedPermissions = permissions
          .filter(item => getFnCode(item, functionCodes));
        if (actionCode) {
          const actionCodes = toArray(actionCode);
          passedPermissions = passedPermissions
            .filter(item => getActionCode(item, actionCodes));
        }
        return isContainArray(permissions) && passedPermissions;
      }

      isActionAllowed(functionCode, actionCode) {
        validateFunctionCode(functionCode);
        const passedPermissions = this.getPassedPermissions(functionCode, actionCode);
        return passedPermissions.length > 0;
      }

      isActionDenied(functionCode, actionCode) {
        return !this.isActionAllowed(functionCode, actionCode);
      }

      permissionFailRedirector(allowedFunctionCode, allowedActionCode, redirector) {
        if (this.isActionAllowed(allowedFunctionCode, allowedActionCode)) {
          return false;
        }

        if (typeof redirector === 'function') {
          return redirector();
        }

        if (typeof redirector !== 'string') {
          return false;
        }
        return (() => {
          window.location.href = redirector;
        })();
      }

      render() {
        const {
          isInitialized,
          propNamespace,
          actionCodes,
          functionCodes,
          permissions,
        } = this.props;
        const childProps = omit(this.props, omitPropNames);
        const componentProps = Object.assign({}, childProps, {
          [propNamespace]: {
            actionCodes,
            functionCodes,
            isActionAllowed: this.isActionAllowed,
            isActionDenied: this.isActionDenied,
            permissionFailRedirector: this.permissionFailRedirector,
          },
        });
        return (isInitialized && permissions)
          ? <WrappedComponent {...componentProps} />
          : null;
      }
    }

    WithPermission.displayName = `withPermission(${Component.displayName || Component.name})`;

    const ConnectedPermission = connect(mapStateToProps, mapDispatchToProps)(WithPermission);
    ConnectedPermission.defaultProps = config;
    return ConnectedPermission;
  };
};

export default withPermission;
