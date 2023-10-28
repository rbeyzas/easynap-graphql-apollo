import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { movies, directors } from './data.js';

// The GraphQL schema
const typeDefs = `#graphql
type Query {
  director(id: ID!): Director!
  movie(id: ID!): Movie!
}

type Director {
  id: ID!
  name: String!
  birth: Int
}

type Movie {
  id: ID!
  title: String!
  description: String!
  year: Int!
}
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    director: (parent, args) => {
      return directors.find((director) => director.id === args.id);
    },
    movie: (parent, args) => {
      return movies.find((movie) => movie.id === args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);

// parent ilişkisel yapılarda kullanacağımız parametredir.
// args bize gelen tüm gelen parametrelerdir
