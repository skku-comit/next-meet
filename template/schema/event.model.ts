import mongoose, { Schema, models } from "mongoose";
import { Participate } from "@/template/Participate";
import { NextMeetUser, User } from "../User";

const eventSchema = new Schema({
  eventID: {
    type: Number,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timeInfo: {
    type: Schema.Types.Mixed,
    required: true,
  },
  participateStatus: {
    type: Array<Array<Participate>>,
    default: [],
  },
  fixedMeeting: {
    type: Array,
    default: [],
  },
  hostUserInfo: {
    type: Schema.Types.Mixed,
    required: true,
  },
  userList:{
    type: Array<(User|NextMeetUser)[]>,
    required: true,
  }
});

const Event = models.Event || mongoose.model("Event", eventSchema);

export default Event;
