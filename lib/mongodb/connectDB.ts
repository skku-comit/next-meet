import mongoose from "mongoose";

// declare global
// {
//     var mongoose:
//     {
//         promise: Promise<Mongoose> | null;
//         connection: Mongoose | null;
//     };
// }

const URI =
  "mongodb+srv://NextMeet:lZV3TPdBrjRuPLWJ@next-meet.xxvqeo1.mongodb.net/Next-Meet";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

const connectDB = async () => {
  if (cached.connection) return cached.connection;

  try {
    if (!cached.promise) {
      cached.promise = mongoose
        .set({ debug: true, strictQuery: false })
        .connect(`${URI}`)
        .then((mongoose) => mongoose);
    }

    cached.connection = await cached.promise;
    console.log("Connected to MongoDB");
    return cached.connection;
  } catch (error) {
    console.log("Failed to connect to MongoDB");
    console.error(error);
  }
};

export default connectDB;
