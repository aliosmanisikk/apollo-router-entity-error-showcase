import { gql } from 'graphql-tag';
import { run, sleep } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.9", import: ["@key", "@shareable", "@interfaceObject"])

  type ShoppingListItem {
    id: ID!
    product(resolveInMs: Int!): Product
    variant: SunglassVariant
  }

  type Product @key(fields: "resolveInMs", resolvable: false) @interfaceObject {
    resolveInMs: Int!
  }

  type SunglassVariant @key(fields: "sku", resolvable: false) {
    sku: String!
  }

  type Inventory @key(fields: "sku") {
    sku: String!
    stock: Int!
  }

  extend type Query {
    myShoppingList: [ShoppingListItem!]!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    myShoppingList: () => [{ id: '1', variant: { sku: '123456' } }],
  },
  ShoppingListItem: {
    product: async (_: unknown, { resolveInMs }: { resolveInMs: number }) => ({ resolveInMs }),
  },
  Inventory: {
    __resolveReference: async ({ sku }: { sku: string }) => {
      await sleep(5);
      return { sku, stock: 5 };
    },
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, 'SubgraphB');
