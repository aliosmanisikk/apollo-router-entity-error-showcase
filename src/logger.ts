import { ApolloServerPlugin, BaseContext, GraphQLRequestContext } from '@apollo/server';

const createLineLogger = (prefix: string) => (requestContext: GraphQLRequestContext<BaseContext>, line: unknown) => {
  if (requestContext.request.query?.includes('IntrospectQuery')) {
    return;
  }

  console.log(`${new Date().toJSON()} ${prefix}: ${line}`);
};

export const loggerPlugin = (prefix: string): ApolloServerPlugin<BaseContext> => {
  const logLine = createLineLogger(prefix);
  return {
    async requestDidStart(requestContext) {
      logLine(requestContext, 'request started');
      logLine(requestContext, `query: ${requestContext.request.query}`);
      logLine(requestContext, `input: ${JSON.stringify(requestContext.request.variables)}`);
      return {
        async didEncounterErrors(requestContext) {
          logLine(requestContext, 'an error happened in response');
          logLine(requestContext, requestContext.errors);
        },
        async willSendResponse(requestContext) {
          logLine(requestContext, 'response sent');
          logLine(requestContext, JSON.stringify(requestContext.response.body));
        },
      };
    },
  };
};
