import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { UserProvider } from "./context/currentUser.jsx";

const authLink = setContext((_, { headers }) => {
  const user = window.localStorage.getItem("user");

  let token = null;
  if (user) {
    token = JSON.parse(user).token;
  }

  return {
    headers: {
      ...headers,
      authorization: token ? token : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <UserProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </UserProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
