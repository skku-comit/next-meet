import mongoose, { Schema, models } from "mongoose";

const NextMeetUserSchema = new Schema({
  loginID: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userID: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  eventIDList: {
    type: Array<Number>,
  },
});

const NextMeetUser = models.NextMeetUser || mongoose.model("NextMeetUser", NextMeetUserSchema);

export default NextMeetUser;
