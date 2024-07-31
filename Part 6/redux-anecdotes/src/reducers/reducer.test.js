import deepFreeze from "deep-freeze";
import anecdoteReducer from "./anecdoteReducer";
import notificationReducer from "./notificationReducer";

describe("Reducer", () => {
  const initState = [
    {
      content: "hello",
      id: 1,
      votes: 0,
    },
  ];

  test("like is increased", () => {
    const state = initState;
    const action = {
      type: "anecdotes/vote",
      payload: 1,
    };
    deepFreeze(state);
    const newState = anecdoteReducer(state, action);

    expect(newState[0]).toEqual({
      content: "hello",
      id: 1,
      votes: 1,
    });
  });

  test("New anecdote create successfully", () => {
    const state = [];
    const action = {
      type: "anecdotes/create",
      payload: {
        content: "New Note",
        id: 2,
        votes: 0,
      },
    };
    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState.length).toEqual(1);
  });

  test("Notification can be sest", () => {
    const state = ""
    const action = {
      type: "notification/set",
      payload: "Hello"
    }

    deepFreeze(state)
    const newState = notificationReducer(state, action)
    expect(newState).toEqual("Hello")
  })
});
