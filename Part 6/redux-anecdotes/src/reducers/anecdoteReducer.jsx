import { createSlice } from "@reduxjs/toolkit";
import AnecdoteService from "../services/AnecdoteService";

const anecSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    append(state, action) {
      state.push(action.payload);
    },

    vote(state, action) {
      const id = action.payload.id;
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.payload
      );
    },

    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { append, vote, setAnecdotes } = anecSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await AnecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnec = (content) => {
  return async (dispatch) => {
    const anecdote = await AnecdoteService.create(content);
    dispatch(append(anecdote));
  };
};

export const voteFor = (anecdote) => {
  return async (dispatch) => {
    const response = await AnecdoteService.adjust(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch(vote(response));
  };
};

export default anecSlice.reducer;
