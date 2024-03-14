import mongoose, { Schema, models } from "mongoose";

const NextMeetUserSchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  loginID: { //id created by user, only required for email account
    type: String,
    required: false,
    unique: true,
  },
  password: { //only required for email account
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
