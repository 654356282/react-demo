import { REACT_ELEMENT_TYPE } from "@react/shared/ReactSymbols";

const REVERSED_PROPS = {
  key: true,
  ref: true,
};

function hasValidRef(config) {
  return config.ref !== undefined;
}

function hasValidKey(config) {
  return config.key !== undefined;
}

function ReactElement(type, key, ref, props) {
  console.log("reactElement")
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  };
  return element;
}

export function createElement(type, config, children) {
  let propName;

  const props = {};

  delete config.__self
  delete config.__source

  let key = null;
  let ref = null;

  if (config !== null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
  }
  if (hasValidKey(config)) {
    key = config.key + "";
  }

  for (propName in config) {
    if (
      config.hasOwnProperty(propName) &&
      !REVERSED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childrenArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childrenArray[i] = arguments[i + 1];
    }
    props.children = childrenArray;
  }

  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(type, key, ref, props);
}
