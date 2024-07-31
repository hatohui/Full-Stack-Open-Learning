import { useNotificationDispatch } from "../reducers/NotificationContext";
import { postAnecdotes } from "../requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation({
    mutationFn: postAnecdotes,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdote"]);
      queryClient.setQueryData(["anecdote"], anecdotes.concat(newAnecdote));
      dispatch({
        type: "SET",
        payload: `anecdote '${newAnecdote.content}' created!`,
      });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    },
    onError: (error) => {
      dispatch({ type: "SET", payload: error.response.data.error });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    },
    refetchOnWindowFocus: false,
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
