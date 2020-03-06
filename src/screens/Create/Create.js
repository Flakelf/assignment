import React, { useState, useCallback } from "react";

import { Pane, toaster } from "evergreen-ui";

import * as R from "ramda";

import { createPost } from "../../helpers/requests";

import { CustomSpinner, PostForm } from "../../components";

const Create = ({ users, history }) => {
  const [state, setState] = useState({
    isLoading: false,
    body: "",
    title: "",
    postAuthor: ""
  });

  const handleSubmit = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));

    const data = R.omit("isLoading", state);

    try {
      await createPost(data);
      toaster.success("Post created succesfully");
      history.push("/");
    } catch (e) {
      toaster.error("Something wrone here");
    }
  }, [history, state]);

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={40}
    >
      {users?.length > 0 ? (
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

export default Create;
