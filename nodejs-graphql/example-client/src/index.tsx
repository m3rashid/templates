import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import "./index.css";
import { Router } from "./App";
import { getAccessToken } from "./utils/tokens";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `bearer ${accessToken}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
