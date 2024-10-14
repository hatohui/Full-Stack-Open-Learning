import { useQuery } from "@apollo/client";
import NavBar from "../components/NavBar";
import { ALL_BOOKS } from "../queries";
import Notification from "../components/Notification";

const Books = () => {
  const result = useQuery(ALL_BOOKS);

  if (result.loading) return <div>Loading...</div>;
  if (result.error) return <div> Error Occured</div>;
  const books = result.data.allBooks;
  return (
    <div>
      <NavBar />
      <Notification />
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
