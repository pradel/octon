import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import initApollo from './init-apollo';

export default ComposedComponent =>
  class WithData extends React.Component {
    public static displayName = `WithData(${ComposedComponent.displayName})`;
    public static propTypes = {
      serverState: PropTypes.object.isRequired,
    };

    public static async getInitialProps(ctx) {
      let serverState = {};

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx);
      }

      // Run all graphql queries in the component tree
      // and extract the resulting data
      if (!process.browser) {
        const apollo = initApollo(null, ctx);
        // Provide the `url` prop data in case a graphql query uses it
        const url = { query: ctx.query, pathname: ctx.pathname };

        // Run all graphql queries
        const app = (
          <ApolloProvider client={apollo}>
            <ComposedComponent url={url} {...composedInitialProps} />
          </ApolloProvider>
        );
        await getDataFromTree(app);

        // Extract query data from the Apollo's store
        const state = apollo.getInitialState();

        serverState = {
          apollo: {
            // Make sure to only include Apollo's data state
            data: state.data,
          },
        };
      }

      return {
        serverState,
        ...composedInitialProps,
      };
    }

    constructor(props) {
      super(props);
      this.apollo = initApollo(this.props.serverState);
    }

    public render() {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
