import Notification from "../components/Notification";
import NavBar from "../components/NavBar";
import { useField } from "../hooks/useField";
import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import { useUser, useUserDispatch } from "../context/currentUser";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { reset: resetUser, ...username } = useField("text");
  const { reset: resetPass, ...password } = useField("password");
  const dispatchU = useUserDispatch();
  const dispatchN = useNotificationDispatch();
  const navigate = useNavigate();
  const currentUser = useUser();
  const client = useApolloClient();

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      dispatchU({
        type: "LOGIN",
        payload: {
          username: username.value,
          token: "Bearer " + data.login.value,
        },
      });

      navigate(-1);
    },
    onError: (error) => {
      const msg = error.graphQLErrors.map((e) => e.message).join("\n");
      dispatchN({ type: "SET", payload: msg });
      setTimeout(() => {
        dispatchN({ type: "RESET" });
      }, 5000);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uN = username.value.trim();
    login({
      variables: { username: uN, password: password.value },
    });
    resetUser();
    resetPass();
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatchU({ type: "LOGOUT", payload: null });
    client.resetStore();
  };

  console.log(currentUser);

  if (currentUser)
    return (
      <div>
        <NavBar />
        <Notification />
        <div>currently logged in as: </div>
        <button onClick={handleLogout}>LOGOUT</button>
      </div>
    );

  return (
    <>
      <NavBar />
      <Notification />
      <br></br>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input {...username} />
        </div>
        <div>
          <label>Password: </label>
          <input {...password} />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
