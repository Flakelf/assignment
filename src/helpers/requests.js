import axios from "axios";

const POSTS_URI = "https://jsonplaceholder.typicode.com/posts";
const USERS_URI = "https://jsonplaceholder.typicode.com/users";

export const getPosts = () => axios.get(POSTS_URI);
export const getUsers = () => axios.get(USERS_URI);

export const deletePost = postNumber =>
  axios.delete(`${POSTS_URI}/${postNumber}`);

export const updatePost = (postNumber, data) =>
  axios.put(`${POSTS_URI}/${postNumber}`, data);

export const createPost = postData => axios.post(POSTS_URI, postData);
