import mongoose, { Schema, models } from "mongoose";

const NextMeetUserGSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userID: { //id for identification, created by server
        type: Number,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    eventIDList: {
        type: Array<Number>,
        default: [],
    },
});

const NextMeetUserG = models.NextMeetUserG || mongoose.model("NextMeetUserG", NextMeetUserGSchema);

export default NextMeetUserG;
