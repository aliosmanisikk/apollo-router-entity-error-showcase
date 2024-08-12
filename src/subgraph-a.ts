import { gql } from 'graphql-tag';
import { isDefined, run, sleep } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.8", import: ["@key"])

  interface Item @key(fields: "slug") {
    slug: String!
    brand: String!
  }

  type SunglassItem implements Item @key(fields: "slug") {
    slug: String!
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
  Item: {
    __resolveReference: async ({ slug }: { slug: string }) => {
      if (!Number.isNaN(parseInt(slug))) {
        await sleep(parseInt(slug));
      }
      return {
        __typename: 'SunglassItem',
        slug,
        brand: 'RayBan',
      };
    },
  },
  SunglassVariant: {
    __resolveReference: async ({ sku }: { sku: string }) => {
      await sleep(10);
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
