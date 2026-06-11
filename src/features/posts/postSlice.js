import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPostsAPI, createPostAPI, deletePostAPI, likePostAPI, dislikePostAPI } from "../../services/api";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchPostsAPI();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createPost = createAsyncThunk("posts/createPost", async (postData, { rejectWithValue }) => {
  try {
    const response = await createPostAPI(postData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (id, { rejectWithValue }) => {
  try {
    await deletePostAPI(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const likePost = createAsyncThunk("posts/likePost", async (id, { rejectWithValue }) => {
  try {
    const response = await likePostAPI(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const dislikePost = createAsyncThunk("posts/dislikePost", async (id, { rejectWithValue }) => {
  try {
    const response = await dislikePostAPI(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(dislikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      });
  },
});

export default postSlice.reducer;
