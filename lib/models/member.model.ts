import mongoose, { Schema, models } from "mongoose";

export const memberSchema = new Schema
({
    loginID:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true,
    },
    memberID:
    {
        type: Number,
        required: true,
    },
    userName:
    {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
    },
    eventIDList:
    {
        type: Array<Number>,
    },
});

const Member = models.Member || mongoose.model("Member", memberSchema);

export default Member;