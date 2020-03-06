import React from "react";

import { Pane, TextInputField, SelectField, Button } from "evergreen-ui";

import * as R from "ramda";

const PostForm = ({ state, setState, handleSubmit, users }) => (
  <Pane
    elevation={4}
    float="left"
    width={600}
    height={500}
    display="flex"
    alignItems="center"
    flexDirection="column"
    backgroundColor="white"
  >
    <TextInputField
      label="Post title"
      hint="Edit post title"
      name="title"
      width={400}
      placeholder="Post title here"
      value={state?.title || ""}
      onChange={e => {
        e.persist();
        return setState(prevState => ({
          ...prevState,
          title: e.target.value
        }));
      }}
      marginTop={40}
      validationMessage={!state?.title && "This field is required"}
      autoComplete="off"
      disabled={state.isLoading}
    />

    <TextInputField
      label="Post body"
      hint="Edit post body"
      name="body"
      width={400}
      placeholder="Post body here"
      value={state?.body || ""}
      onChange={e => {
        e.persist();
        return setState(prevState => ({
          ...prevState,
          body: e.target.value
        }));
      }}
      marginTop={10}
      validationMessage={!state?.body && "This field is required"}
      autoComplete="off"
      disabled={state.isLoading}
    />

    <SelectField
      label="Post by"
      width={400}
      value={state?.postAuthor}
      onChange={e => {
        e.persist();
        setState(prevState => ({ ...prevState, postAuthor: e.target.value }));
      }}
      validationMessage={!state?.postAuthor && "This field is required"}
      disabled={state.isLoading}
    >
      <option value="" />
      {users.map(user => (
        <option key={user.id} value={user.name}>
          {user.name}
        </option>
      ))}
    </SelectField>

    <Button
      appearance="primary"
      intent="success"
      isLoading={state.isLoading}
      marginTop={20}
      height={40}
      onClick={handleSubmit}
      disabled={
        Object.values(R.pick(["title", "body", "postAuthor"], state)).filter(
          value => !!value
        ).length !== 3
      }
    >
      {state.isLoading ? "Submitting" : "Submit"}
    </Button>
  </Pane>
);

export default PostForm;
