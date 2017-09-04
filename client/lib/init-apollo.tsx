import { ApolloClient, createNetworkInterface } from 'react-apollo';
import * as fetch from 'isomorphic-fetch';
import auth from '../utils/auth';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, ctx) {
  const networkInterface = createNetworkInterface({
    uri: process.env.GRAPHCOOL_URL,
  });

  // Add token to make authenticated requests
  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }

        const token = auth.getToken(ctx);
        if (token) {
          req.options.headers.authorization = `Bearer ${token}`;
        }
        next();
      },
    },
  ]);

  return new ApolloClient({
    initialState,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    networkInterface,
    dataIdFromObject: (o: any) => `${o.__typename}-${o.id}`,
  });
}

export default function initApollo(initialState, ctx) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, ctx);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, ctx);
  }

  return apolloClient;
}
