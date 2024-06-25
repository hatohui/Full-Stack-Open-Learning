import { useDispatch } from "react-redux";

const AnecCreation = () => {
  const dispatch = useDispatch()

  const addNew = (event) => {
    event.preventDefault()
    console.log(event.target.newAnec)
  }
  
  return (
    <>
      <h2>create new</h2>
      <form onSubmit = {addNew}>
        <div>
          <input name="newAnec" />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default AnecCreation;
