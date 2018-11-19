import { Children } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

const omitPropNames = ['render', 'condition'];

export const propTypes = {
  render: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  on: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  run: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

const Verifier = (props) => {
  const {
    render,
    run,
    on,
    condition,
    children,
  } = props;
  const childProps = omit(props, omitPropNames);

  if (!condition(on, run)) return null;

  if (render) return render(childProps);

  if (typeof children === 'function') return children(childProps);

  return children ? Children.only(children) : null;
};

Verifier.propTypes = Object.assign({
  condition: PropTypes.func.isRequired,
}, propTypes);

export default Verifier;
