import { useDispatch } from "react-redux";
import {createAnec} from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecCreation = () => {
  const dispatch = useDispatch();

  const addNew = async (event) => {
    event.preventDefault();
    const content = event.target.newAnec.value;
    dispatch(createAnec(content));
    dispatch(setNotification(`You created ${content}`));
    event.target.newAnec.value = "";
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNew}>
        <div>
          <input name="newAnec" />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default AnecCreation;
