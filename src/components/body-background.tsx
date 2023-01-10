import * as React from "react";
import { skinVars } from "@telefonica/mistica";

const BodyBackground = (): JSX.Element => {
  const css = `body {background:${skinVars.colors.background}}`;
  return <style>{css}</style>;
};

export default BodyBackground;
