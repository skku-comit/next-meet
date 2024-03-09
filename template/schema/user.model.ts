import mongoose, { Schema, models } from "mongoose";

const NextMeetUserSchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  loginID: { //id created by user
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  userID: { //id for identification, created by server
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
    default: [],
  },
});

const NextMeetUser = models?.NextMeetUser || mongoose.model("NextMeetUser", NextMeetUserSchema);

export default NextMeetUser;
