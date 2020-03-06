import React, { useEffect, useState, useCallback } from "react";

import { Pane, toaster } from "evergreen-ui";

import * as R from "ramda";

import { updatePost } from "../../helpers/requests";

import { CustomSpinner, PostForm } from "../../components";

const Edit = ({ posts, users, match, history }) => {
  const [state, setState] = useState({
    isLoading: false
  });

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      ...posts?.find(post => post.id === +match.params.id),
      postAuthor:
        users?.find(
          user =>
            user.id ===
            posts?.find(post => post.id === +match.params.id)?.userId
        )?.name || ""
    }));
  }, [match.params.id, posts, users]);

  const handleSubmit = useCallback(async () => {
    const data = R.omit(["isLoading"], state);

    setState(prevState => ({ ...prevState, isLoading: true }));

    try {
      await updatePost(match.params.id, data);
      toaster.success("Post updated succesfully");
      history.push("/");
    } catch (e) {
      toaster.error("Something wrone here");
    }
  }, [match.params.id, state, history]);

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={40}
    >
      {users?.length > 0 && posts?.length > 0 ? (
        <PostForm
          state={state}
          setState={setState}
          handleSubmit={handleSubmit}
          users={users}
        />
      ) : (
        <CustomSpinner marginTop={200} />
      )}
    </Pane>
  );
};

export default Edit;
