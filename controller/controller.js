import userSchema from "../model/userModel.js";
import jwt from "jsonwebtoken";

export const createUser = async ({ firstName, lastName, email, password }) => {
  const createdUser = new userSchema({
    firstName,
    lastName,
    email,
    password,
  });

  const res = await createdUser.save();
  return res;
};

export const deleteUserById = async (ID) => {
  const wasDeleted = (await userSchema.deleteOne({ _id: ID })).deletedCount;
  return wasDeleted;
};

export const editUserById = async (
  ID,
  { firstName, lastName, email, password }
) => {
  const wasEdited = (
    await userSchema.updateOne(
      { _id: ID },
      {
        firstName,
        lastName,
        email,
        password,
      }
    )
  ).modifiedCount;
  return wasEdited;
};

export const getUsers = async (amount) => {
  return await userSchema.find().limit(amount);
};

export const getUserById = async (ID) => {
  return await userSchema.findById(ID);
};

export const userLogin = async (email, password) => {
  const user = await userSchema.findOne({ email, password });
  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign({ userId: user.id }, "your-secret-key", {
    expiresIn: "3d",
  });
  return {
    token,
  };
};
