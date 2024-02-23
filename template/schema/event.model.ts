import mongoose, { Schema, models } from "mongoose";
import { Participate } from "@/template/Participate";

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
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  participateStatus: {
    type: Array<Participate>,
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
});

const Event = models.Event || mongoose.model("Event", eventSchema);

export default Event;
