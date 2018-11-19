import React from 'react';
import PropTypes from 'prop-types';
import Verifier, { propTypes as verifierPropTypes } from '../Verifier';

const contextTypes = {
  _userPermissions: PropTypes.object,
};

const Can = (props, context) => {
  const { render } = props;
  return (
    <Verifier
      {...props}
      render={render}
      condition={context._userPermissions.isActionAllowed}
    />
  );
};

Can.propTypes = verifierPropTypes;
Can.contextTypes = contextTypes;

export default Can;
