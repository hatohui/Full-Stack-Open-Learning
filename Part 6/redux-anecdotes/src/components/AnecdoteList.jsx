import { useDispatch, useSelector } from "react-redux";
import { voteFor } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const sorted = [...anecdotes].sort(
      (first, second) => second.votes - first.votes
    );
    return sorted.filter((each) => each.content.toLowerCase().includes(filter));
  });

  const dispatch = useDispatch();

  const handleVoting = (event) => {
    const anecdote = anecdotes.find((each) => each.id === event.target.value);
    dispatch(voteFor(anecdote));
    dispatch(setNotification(`you voted "${anecdote.content}"`));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} vote={handleVoting} anecdote={anecdote} />
      ))}
    </div>
  );
};

const Anecdote = ({ anecdote, vote }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        {`has ${anecdote.votes} `}
        <button value={anecdote.id} onClick={vote}>
          vote
        </button>
      </div>
    </div>
  );
};

export default AnecdoteList;
