import mongoose, { Schema, models } from "mongoose";

export interface User {
  userID: number;
  userName: string;
  password: string;
}

export interface NextMeetUser extends User {
  loginID: string;
  email: string;
  eventIDList: string[]; //이미 참여한 이벤트 or 자신이 호스트인 이벤트
}

const UserSchema = new Schema({
  userID: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const NextMeetUserSchema = new Schema({
  userName: {
    type: String,
    require: true,
  },
  userID: {
    type: String,
    require: true,
  },
  loginID: {
    type: String,
    require: true,
  },
  password: { 
    type: String, 
    require: true 
  },
  email: {
    type: String,
    require: true,
  },
  eventIDList: {
    type: [String],
    require: true,
  },
});

export const User = models.User || mongoose.model("User", UserSchema);
export const NextMeetUser = models.NextMeetUser || mongoose.model("NextMeetUser", NextMeetUserSchema);