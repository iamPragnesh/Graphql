import mongoose from "mongoose";

const connectToDataBase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabase");
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Connection failed");
  }
};

export default connectToDataBase;
