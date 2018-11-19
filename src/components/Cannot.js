import React from 'react';
import PropTypes from 'prop-types';
import Verifier, { propTypes as verifierPropTypes } from '../Verifier';

const contextTypes = {
  _userPermissions: PropTypes.object,
};

const Cannot = (props, context) => {
  const { render } = props;
  return (
    <Verifier
      {...props}
      render={render}
      condition={context._userPermissions.isActionDenied}
    />
  );
};

Cannot.propTypes = verifierPropTypes;
Cannot.contextTypes = contextTypes;

export default Cannot;
