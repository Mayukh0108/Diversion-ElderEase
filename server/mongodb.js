import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB")
    })
    await mongoose.connect(`${process.env.MONGO_URI}/auth_demo`)
}

export default connectDB;