import React from "react";
import { Pane } from "evergreen-ui";

import { PostsTable } from "../../components";

const Main = ({ posts, users }) => (
  <Pane
    display="flex"
    alignItems="center"
    justifyContent="center"
    marginTop={40}
  >
    <PostsTable posts={posts} users={users} />
  </Pane>
);

export default Main;
