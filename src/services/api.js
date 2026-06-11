import axios from "axios";

const API = axios.create({ baseURL: "https://focusforge-v9x1.onrender.com/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerAPI = (formData) => API.post("/users/register", formData);
export const loginAPI = (formData) => API.post("/users/login", formData);
export const updateProfileAPI = (formData) => API.put("/users/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const fetchPostsAPI = () => API.get("/posts");
export const createPostAPI = (postData) => API.post("/posts/create", postData, { headers: { "Content-Type": "multipart/form-data" } });
export const deletePostAPI = (id) => API.delete(`/posts/${id}`);
export const likePostAPI = (id) => API.put(`/posts/like/${id}`);
export const dislikePostAPI = (id) => API.put(`/posts/dislike/${id}`);

export const fetchCommentsAPI = (postId) => API.get(`/comments/post/${postId}`);
export const addCommentAPI = (data) => API.post("/comments/create", data);
export const deleteCommentAPI = (id) => API.delete(`/comments/${id}`);

export const addReplyAPI = (commentId, data) => API.post(`/comments/reply/${commentId}`, data);
export const deleteReplyAPI = (commentId, replyId) => API.delete(`/comments/reply/${commentId}/${replyId}`);
