import { gql } from 'graphql-tag';
import { run, sleep } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.9", import: ["@key"])

  interface Product @key(fields: "resolveInMs") {
    resolveInMs: Int!
    brand: String!
  }

  type SunglassProduct implements Product @key(fields: "resolveInMs") {
    resolveInMs: Int!
    brand: String!
  }

  type SunglassVariant @key(fields: "sku") {
    sku: String!
    color: String!
    inventory: Inventory!
  }

  type Inventory @key(fields: "sku", resolvable: false) {
    sku: String!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Product: {
    __resolveReference: async ({ resolveInMs }: { resolveInMs: number }) => {
      await sleep(resolveInMs);
      return {
        __typename: 'SunglassProduct',
        resolveInMs,
        brand: 'RayBan',
      };
    },
  },
  SunglassVariant: {
    __resolveReference: async ({ sku }: { sku: string }) => {
      await sleep(3);
      return {
        __typename: 'SunglassVariant',
        sku,
        color: 'green',
        inventory: {
          sku,
        },
      };
    },
  },
};

export const runA = () => run(typeDefs, resolvers, 3001, 'SubgraphA');
