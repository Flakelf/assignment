import React, { useMemo, useCallback } from "react";
import { withRouter } from "react-router-dom";

import { Pane, Heading, Button } from "evergreen-ui";

const Layout = ({ location: { pathname }, history }) => {
  const headerByPage = useMemo(
    () => ({
      "": "Posts",
      create: "New post",
      edit: "Edit post"
    }),
    []
  );

  const currentPage = useMemo(() => pathname.split("/")[1], [pathname]);

  const returnToTablePage = useCallback(() => history.push("/"), [history]);

  const pushToNewPostPage = useCallback(() => history.push("/create"), [
    history
  ]);

  return (
    <Pane>
      <Pane
        height="100%"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading size={900} marginTop="default">
          {headerByPage[currentPage]}
        </Heading>

        <Pane>
          {!!currentPage && (
            <Button
              appearance="primary"
              marginTop={20}
              onClick={returnToTablePage}
              marginRight={currentPage !== "create" ? 40 : 0}
            >
              Back to table
            </Button>
          )}
          {currentPage !== "create" && (
            <Button
              appearance="primary"
              marginTop={20}
              onClick={pushToNewPostPage}
            >
              Create post
            </Button>
          )}
        </Pane>
      </Pane>
    </Pane>
  );
};

export default withRouter(Layout);
