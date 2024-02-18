import { Mongoose } from "mongoose"

// /* eslint-disable no-var */
// declare global
// {
//     let mongoose: 
//     {
//         promise: Promise<Mongoose> | null;
//         connection: Mongoose | null;
//     };
// }

// export const connectMongoDB = async () =>{
//     try{
//         await mongoose.connect(process.env.MONGODB_URI!);
//         console.log("Connected to MongoDB");
//     }
//     catch(error){
//         console.log("Error connecting to MongoDB: ",error);
//     }
// }