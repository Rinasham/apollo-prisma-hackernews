const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils");

// Sign up
async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);

  const user = context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// Login
async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("そのようなユーザーはいません");
  }
  // compare password (boolean)
  const isValid = await bcrypt.compare(args.password, user.password);
  if (!isValid) {
    throw new Error("パスワードが無効です");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// linkをpost
async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function vote(parent, args, context) {
  const userId = context.userId;
  const vote = context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });
  if (Boolean(vote)) {
    throw new Error(`Already voted: ${args.linkId}`);
  }
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args, linkId) } },
    },
  });

  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
