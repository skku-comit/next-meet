import * as Mongoose from "mongoose";

const URI =
    "mongodb+srv://NextMeet:lZV3TPdBrjRuPLWJ@next-meet.xxvqeo1.mongodb.net/Next-Meet";

export default function connectDB()
{
    try
    {
        Mongoose.connect(URI);
    }
    catch (error)
    {

    }
}