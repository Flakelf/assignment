import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { getPosts, getUsers } from "./helpers/requests";

import { Main, Edit, Create } from "./screens";

import { Layout } from "./components";

const App = () => {
  const [users, setUsers] = useState();
  const [posts, setPosts] = useState();

  useEffect(() => {
    getPosts().then(({ data }) => setPosts(data));
    getUsers().then(({ data }) => setUsers(data));
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Layout />

        <Switch>
          <Route
            exact
            path="/"
            render={props => <Main users={users} posts={posts} {...props} />}
          />
          <Route
            exact
            path="/edit/:id"
            render={props => <Edit users={users} posts={posts} {...props} />}
          />

          <Route
            exact
            path="/create"
            render={props => <Create users={users} {...props} />}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
