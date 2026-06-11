import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCommentsAPI, addCommentAPI, deleteCommentAPI, addReplyAPI, deleteReplyAPI } from "../../services/api";

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk("comments/fetchComments", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetchCommentsAPI(postId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addComment = createAsyncThunk("comments/addComment", async (data, { rejectWithValue }) => {
  try {
    const response = await addCommentAPI(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteComment = createAsyncThunk("comments/deleteComment", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteCommentAPI(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addReply = createAsyncThunk("comments/addReply", async ({ commentId, text }, { rejectWithValue }) => {
  try {
    const response = await addReplyAPI(commentId, { text });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteReply = createAsyncThunk("comments/deleteReply", async ({ commentId, replyId }, { rejectWithValue }) => {
  try {
    const response = await deleteReplyAPI(commentId, replyId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(addReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(deleteReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.comments[index] = action.payload;
      });
  },
});

export default commentSlice.reducer;
