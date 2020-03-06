import React, { useState, useCallback, useMemo } from "react";
import { filter as fuzzaldrinFilter } from "fuzzaldrin-plus";
import { withRouter } from "react-router-dom";
import {
  Table,
  Popover,
  Position,
  Menu,
  Avatar,
  Text,
  IconButton,
  TextDropdownButton,
  Pane,
  Heading,
  Paragraph,
  Dialog,
  toaster
} from "evergreen-ui";

import CustomSpinner from "../CustomSpinner/CustomSpinner";

import { deletePost } from "../../helpers/requests";

const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const Order = {
  NONE: "NONE",
  ASC: "ASC",
  DESC: "DESC"
};

const PostsTable = ({ posts, users, history }) => {
  const [state, setState] = useState({
    searchQuery: "",
    orderedColumn: 1,
    ordering: Order.NONE,
    column2Show: "title",
    isDeleteModalOpen: false,
    forDelete: {},
    isLoading: false
  });

  const handleDelete = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));

    try {
      await deletePost(state.forDelete.id);
      toaster.success("Post successfully deleted");
    } catch (e) {
      toaster.danger("Something wrong");
    }

    setState(prevState => ({
      ...prevState,
      isLoading: false,
      isDeleteModalOpen: false
    }));
  }, [state.forDelete.id]);

  const sort = useCallback(
    posts => {
      const { ordering, orderedColumn } = state;
      if (ordering === Order.NONE) return posts;

      let propKey = "title";
      if (orderedColumn === 2) propKey = state.column2Show;

      if (orderedColumn === 3) propKey = "ltv";

      return posts.sort((a, b) => {
        let aValue = a[propKey];
        let bValue = b[propKey];

        const sortTable = { true: 1, false: -1 };

        if (state.ordering === Order.ASC) {
          return aValue === bValue ? 0 : sortTable[aValue > bValue];
        }

        return bValue === aValue ? 0 : sortTable[bValue > aValue];
      });
    },
    [state]
  );

  const filter = useCallback(
    posts => {
      const searchQuery = state.searchQuery.trim();

      if (searchQuery.length === 0) return posts;

      return posts.filter(post => {
        const result = fuzzaldrinFilter([post.title], searchQuery);
        return result.length === 1;
      });
    },
    [state.searchQuery]
  );

  const getIconForOrder = useMemo(
    () => order => {
      switch (order) {
        case Order.ASC:
          return "arrow-up";
        case Order.DESC:
          return "arrow-down";
        default:
          return "caret-down";
      }
    },
    []
  );
  const handleFilterChange = useCallback(
    () => value => {
      setState(prevState => ({ ...prevState, searchQuery: value }));
    },
    []
  );

  const renderTitleHeaderCell = useMemo(
    () => () => (
      <Table.HeaderCell>
        <Popover
          position={Position.BOTTOM_LEFT}
          content={({ close }) => (
            <Menu>
              <Menu.OptionsGroup
                title="Order"
                options={[
                  { label: "Ascending", value: Order.ASC },
                  { label: "Descending", value: Order.DESC }
                ]}
                selected={state.orderedColumn === 2 ? state.ordering : null}
                onChange={value => {
                  setState(prevState => ({
                    ...prevState,
                    orderedColumn: 2,
                    ordering: value
                  }));
                  close();
                }}
              />

              <Menu.Divider />

              <Menu.OptionsGroup
                title="Show"
                options={[
                  { label: "Title", value: "title" },
                  { label: "Body", value: "body" }
                ]}
                selected={state.column2Show}
                onChange={value => {
                  setState(prevState => ({ ...prevState, column2Show: value }));
                  close();
                }}
              />
            </Menu>
          )}
        >
          <TextDropdownButton
            icon={
              state.orderedColumn === 2
                ? getIconForOrder(state.ordering)
                : "caret-down"
            }
          >
            {capitalize(state.column2Show)}
          </TextDropdownButton>
        </Popover>
      </Table.HeaderCell>
    ),
    [getIconForOrder, state.column2Show, state.orderedColumn, state.ordering]
  );

  const renderRow = useMemo(
    () => ({ post }) => (
      <Table.Row key={post.id}>
        <Table.Cell display="flex" alignItems="center">
          <Avatar name={users.find(user => user.id === post.userId).name} />
          <Text marginLeft={8} size={300} fontWeight={500}>
            {post.title}
          </Text>
        </Table.Cell>
        <Table.TextCell>
          {users.find(user => user.id === post.userId).name}
        </Table.TextCell>
        <Table.TextCell>{post[state.column2Show]}</Table.TextCell>
        <Table.Cell width={80} flex="none">
          <Pane display="flex" justifyContent="center">
            <IconButton
              icon="trash"
              height={24}
              intent="danger"
              marginRight={4}
              onClick={() =>
                setState(prevState => ({
                  ...prevState,
                  isDeleteModalOpen: true,
                  forDelete: post
                }))
              }
            />
            <IconButton
              icon="edit"
              height={24}
              onClick={() => history.push(`edit/${post.id}`)}
            />
          </Pane>
        </Table.Cell>
      </Table.Row>
    ),
    [history, state.column2Show, users]
  );

  const items = filter(sort(posts));

  return (
    <React.Fragment>
      {posts?.length > 0 && users?.length > 0 ? (
        <Table border>
          <Table.Head>
            <Table.SearchHeaderCell
              onChange={handleFilterChange}
              value={state.searchQuery}
            />
            <Table.HeaderCell>
              <Paragraph>Author</Paragraph>
            </Table.HeaderCell>
            {renderTitleHeaderCell()}
            <Table.HeaderCell width={80} flex="none" />
          </Table.Head>

          <Table.VirtualBody height={540} width={1200}>
            {items.map(post => renderRow({ post }))}
          </Table.VirtualBody>
        </Table>
      ) : (
        <CustomSpinner />
      )}

      <Dialog
        isShown={state.isDeleteModalOpen}
        title="Delete confirmation"
        onCloseComplete={() =>
          setState(prevState => ({ ...prevState, isDeleteModalOpen: false }))
        }
        confirmLabel="Yes, sure"
        onConfirm={handleDelete}
        isConfirmLoading={state.isLoading}
        shouldCloseOnOverlayClick={!state.isLoading}
        shouldCloseOnEscapePress={!state.isLoading}
        hasClose={!state.isLoading}
        hasCancel={!state.isLoading}
      >
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <React.Fragment>
            {!!state.forDelete.userId && (
              <Heading size={400} marginTop="default">
                Do u really want to delete post with id: {state.forDelete.id} by{" "}
                {users.find(user => user.id === state.forDelete.userId).name}
              </Heading>
            )}
          </React.Fragment>
        </Pane>
      </Dialog>
    </React.Fragment>
  );
};

export default withRouter(PostsTable);
