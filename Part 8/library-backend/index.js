const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
const Author = require("./models/Author.jsx");
const Book = require("./models/Book.jsx");
const User = require("./models/User.jsx");
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", false);
require("dotenv").config();

//get the link to DB
const MONGODB_URL = process.env.MONGODB_URL;

//connect to database
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log("error while connecting to DB: ", error.message);
  });

//type definition
const typeDefs = `
  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ):Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ):Author

    createUser(
    username: String!
    favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type User {
    username: String!
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }
`;

//Resolvers
const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) filter.author = args.author;
      if (args.genre) filter.genres = { $in: args.genre };

      const books = await Book.find(filter).populate("author", {
        name: 1,
        born: 1,
        books: 1,
      });
      return books;
    },
    allAuthors: async (root, args) => await Author.find({}),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      //Check if logged in
      const user = context.currentUser;

      if (!user) {
        console.log("errored");

        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      //find author
      let author = await Author.findOne({ name: args.author });

      //if no author -> create new Author
      if (!author) {
        author = new Author({
          name: args.author,
          born: null,
          books: [],
        });
        await author.save();
      }

      const book = new Book({ ...args, author: author._id });
      const addedBook = await book.save();

      author.books = author.books.concat(addedBook._id);
      const newAuthor = await author.save();

      return { ...addedBook, author: newAuthor };
    },
    editAuthor: async (root, args, context) => {
      //Check if logged in
      const user = context.currentUser;

      if (!user)
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      if (args.setBornTo < 0)
        throw new GraphQLError("Birth year must be larger than 0.", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
          },
        });

      if (args.setBornTo > 2024)
        throw new GraphQLError("Birth year must be smaller than 2024.", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
          },
        });
      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Editing author's born year failed.", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
          },
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = await User.find({ username: args.username });
      if (!user) {
        throw new GraphQLError("User already exist", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args.username },
        });
      }
      const newUser = new User({ ...args, password: "secret" });
      try {
        await newUser.save();
      } catch (error) {
        throw new GraphQLError("creating new user failed.", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
          },
        });
      }
      return newUser;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, process.env.JWL_SECRET),
      };
    },
  },

  Book: {
    title: (root) => root.title,
    author: (root) => root.author,
    published: (root) => root.published,
    genres: (root) => root.genres,
  },

  Author: {
    name: (root) => root.name,
    bookCount: (root) => root.books.length,
    born: (root) => root.born,
  },
};

//config server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//start the server
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const authorization = req ? req.headers.authorization : null;
    if (authorization && authorization.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        authorization.substring(7),
        process.env.JWL_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
