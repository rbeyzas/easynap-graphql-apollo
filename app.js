import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { movies, directors } from './data.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fs from 'fs';
const typeDefs = fs.readFileSync('./graphql/schema/schema.graphql', 'utf-8');

// bir yönetmenin birden fazla filmi olabilir bu sebepten tanımlama yaparken movies: [Movie!]! şeklinde tanımladık
// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    director: (parent, args) => {
      return directors.find((director) => director.id === args.id);
    },
    directors: () => directors,
    movie: (parent, args) => {
      return movies.find((movie) => movie.id === args.id);
    },
    movies: () => movies,
  },
  Mutation: {
    createDirector: (parent, args) => {
      const director = {
        id: Math.random().toString(36).substr(2, 10),
        ...args.data,
      };
      directors.push(director);

      return director;
    },
    createMovie: (parent, args) => {
      const directorExists = directors.some((director) => director.id === args.data.directorId);

      if (!directorExists) {
        throw new Error('Director does not exists.');
      }

      const movie = {
        id: Math.random().toString(36).substr(2, 10),
        ...args.data,
      };

      movies.push(movie);

      return movie;
    },
  },
  Movie: {
    director: (parent, args) => {
      return directors.find((director) => director.id === parent.directorId);
    },
  },
  Director: {
    movies: (parent, args) => {
      return movies.filter((movie) => movie.directorId === parent.id);
    },
  },
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);

// parent ilişkisel yapılarda kullanacağımız parametredir. parent içinde verinin kendisi bulunur.
// args bize gelen tüm gelen parametrelerdir
//  directors: [Director] tüm direktörleri getirecek bir array
// eğer datanın içerisinde null bir data varsa ve bunun gelmesini istemiyorsan directors: [Director!] yaptığında null değer varsa hata alırsın ve null değer geldiğini anlarsın
// eğer datanın (arrayin) komple null olarak ngelmesini sitemiyorsan directors: [Director!]! şeklinde yazman gerek.
// some() verilen kritere göre eğer datalardan biri tutuyıorsa true tutmuyorsa false döner.
