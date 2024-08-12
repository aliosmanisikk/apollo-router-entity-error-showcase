import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServerPluginUsageReportingDisabled, ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { DocumentNode, print } from 'graphql';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';
import { loggerPlugin } from './logger';

export const isDefined = <T>(arg?: null | T) => arg !== undefined && arg !== null;
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const run = async (
  typeDefs: DocumentNode | DocumentNode[],
  resolvers: GraphQLResolverMap<unknown>,
  port: number,
  subgraphName: string
) => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginUsageReportingDisabled(), ApolloServerPluginInlineTraceDisabled(), loggerPlugin(subgraphName)],
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀 ${subgraphName} ready at ${url}`);

  return server;
};
