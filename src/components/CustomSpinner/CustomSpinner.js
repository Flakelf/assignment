import React from "react";

import { Pane, Spinner, Heading } from "evergreen-ui";

const CustomSpinner = props => (
  <Pane
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    {...props}
  >
    <Spinner size={128} />
    <Heading size={900} marginTop="default">
      Загрузочка....
    </Heading>
  </Pane>
);

export default CustomSpinner;
