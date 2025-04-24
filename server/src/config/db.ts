import mongoose from "mongoose";

const mongoDB_URI: string | undefined = process.env.MONGODB_URI
console.log(mongoDB_URI)
const connectDB = async () => {
    try {

        if (!mongoDB_URI){
            throw new Error("MongoDB is not defined in env variables")
        }
        const conn = await mongoose.connect(mongoDB_URI);
        console.log(`Mongo DB connected: ${conn.connection.host} and ${conn.connection.name}`);
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

export default connectDB