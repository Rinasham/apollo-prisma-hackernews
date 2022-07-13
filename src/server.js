const { ApolloServer, gql, PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");
// Apolloserverの中にcontextを書く必要あり
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

// resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Vote = require("./resolvers/Vote");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const typeDefs = gql`
  ${fs.readFileSync(path.resolve(__dirname, "schema.graphql").toString())}
`;

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
