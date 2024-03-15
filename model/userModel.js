import mongoose from "mongoose";

const userRegistration = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const userSchema = new mongoose.model("user", userRegistration);

export default userSchema;
