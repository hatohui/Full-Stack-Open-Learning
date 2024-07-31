import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, putAnecdotes } from "./requests";
import { useContext } from "react";
import NotificationContext from "./reducers/NotificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const [notification, dispatch] = useContext(NotificationContext);

  const votingMutation = useMutation({
    mutationFn: putAnecdotes,
    onSuccess: (returned) => {
      const anecdotes = queryClient.getQueryData(["anecdote"]);
      queryClient.setQueryData(
        ["anecdote"],
        anecdotes.map((anecdote) =>
          anecdote.id === returned.id ? returned : anecdote
        )
      );
    },
  });

  const handleVote = (anecdote) => {
    votingMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    });

    dispatch({ type: "SET", payload: `anecdote '${anecdote.content}' voted` });
    setTimeout(() => {
      dispatch({ type: "RESET" });
    }, 5000);
  };

  const { data, isError, isPending } = useQuery({
    queryKey: ["anecdote"],
    queryFn: () => getAnecdotes(),
  });

  if (isPending) {
    return <div>Loading... </div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
