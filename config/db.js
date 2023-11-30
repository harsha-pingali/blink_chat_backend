import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const con = await mongoose.connect(uri);
    console.log("Db Connected Successfully !: " + con.connection.host);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectDB;
