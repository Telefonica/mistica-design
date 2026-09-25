import React, { forwardRef } from "react";

const WithForwardedRef = (Component) => {
  const ForwardedRefComponent = (props, ref) => {
    return <Component {...props} forwardedRef={ref} />;
  };

  return forwardRef(ForwardedRefComponent);
};

export default WithForwardedRef;
