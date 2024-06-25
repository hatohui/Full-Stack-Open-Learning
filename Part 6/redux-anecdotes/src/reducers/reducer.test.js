import deepFreeze from "deep-freeze";
import reducer from "./anecdoteReducer";

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
      type: "VOTE",
      payload: {
        id: 1,
      },
    };
    deepFreeze(state);
    const newState = reducer(state, action);

    expect(newState).toEqual([
      {
        content: "hello",
        id: 1,
        votes: 1,
      },
    ]);
  });

  test('New anecdote create successfully', () => {
    const state = initState
    const action = {
        type: 'CREATE',
        payload: {
            content: "New Note",
            id: 2,
            votes: 0
        }
    }
    deepFreeze(state)
    const newState = reducer(state, action)

    expect(newState.length).toEqual(2)
  })
});
