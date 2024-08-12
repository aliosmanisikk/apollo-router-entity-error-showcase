import { gql } from 'graphql-tag';
import { run, sleep } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.8", import: ["@key", "@shareable", "@interfaceObject"])

  type ShoppingListItem {
    id: ID!
    item(slug: String): Item
    variant: SunglassVariant
  }

  type Item @key(fields: "slug", resolvable: false) @interfaceObject {
    slug: String!
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
    item: async (_: unknown, { slug }: { slug?: string }) => {
      return { slug: slug || 'my-slug' };
    },
  },
  Inventory: {
    __resolveReference: async ({ sku }: { sku: string }) => {
      await sleep(10);
      return {
        sku,
        stock: 5,
      };
    },
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, 'SubgraphB');
