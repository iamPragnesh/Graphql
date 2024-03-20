import {
  getUserById,
  getUsers,
  createUser,
  deleteUserById,
  editUserById,
  userLogin,
} from "../controller/controller.js";
import userSchema from "../model/userModel.js";
import jwt from "jsonwebtoken";
import services from "../subscription/subscription.js";

async function authenticator(token) {
  if (!token) {
    throw new Error("Token not Found.");
  }
  const decodedToken = jwt.verify(token.split(" ")[1], "your-secret-key");
  const user = await userSchema.findById(decodedToken.userId);
  if (!user) {
    throw new Error("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
  return user;
}

// Define how data is fetched or manipulate with field
const resolvers = {
  Query: {
    user: (_, { ID }) => getUserById(ID),
    getUsers: (_, { amount }) => getUsers(amount),
  },

  Mutation: {
    createUser: async (_, { UserInput }) => createUser(UserInput),
    deleteUser: async (_, { ID }, context) => {
      try {
        await authenticator(context.headers.authorization);
        return deleteUserById(ID);
      } catch (error) {
        return error;
      }
    },
    editUser: (_, { ID, userInput }) => editUserById(ID, userInput),
    userLogin: (_, { email, password }) => userLogin(email, password),
  },

  Subscription: {
    userAdded: {
      // Subscribe to userAdded event
      subscribe: () => services.getDataEvent("USER_ADDED"),
    },
  },
};

export default resolvers;
