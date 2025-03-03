import { useState } from "react";
import NavBar from "../components/NavBar";
import { useMutation } from "@apollo/client";
import { ADD_BOOK, ALL_BOOKS } from "../queries";
import Notification from "../components/Notification";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { updateBookCache } from "./Books";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const dispatch = useNotificationDispatch();
  const navigate = useNavigate();

  const [createBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const msg = error.graphQLErrors.map((e) => e.message).join("\n");
      dispatch({ type: "SET", payload: msg });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    },
    update: (cache, response) => {
      updateBookCache(
        cache,
        { query: ALL_BOOKS, variables: { genre: null, author: null } },
        response.data.addBook
      );
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    createBook({
      variables: { title, author, published: parseInt(published), genres },
    });
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
    navigate("/books");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <NavBar />
      <Notification />

      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
