import { useField } from "../hooks/index";

const CreateNew = (props) => {
  const { reset: contentReset, ...content } = useField("text");
  const { reset: authorReset, ...author } = useField("text");
  const { reset: infoReset, ...info } = useField("text");

  const handleReset = () => {
    console.log("hey");
    contentReset();
    authorReset();
    infoReset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    props.addNew({
      content,
      author,
      info,
      votes: 0,
    });
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
