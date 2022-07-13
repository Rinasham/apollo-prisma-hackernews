const jwt = require("jsonwebtoken");

const APP_SECRET = "graphql-udemy-Shincode222";

// to get user id
function getUserId(req, authToken) {
  if (req) {
    // confirm header
    // authorization : "Bearer token"
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("トークンが見つかりません");
      }
      // トークンの復号(別関数に記述)
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(token);
    return userId;
  } else {
    throw new Error("認証権限がありません");
  }
}

// トークン復号
function getTokenPayload(token) {
  // トークン化される前のもの(user.id)を復号
  return jwt.verify(token, APP_SECRET);
}

module.exports = {
  APP_SECRET,
  getUserId,
};
