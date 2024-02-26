import { NextMeetUser, User } from "./User"

export type Participate = {
    time?:Date[]; //ex) "2024-2-11 11:00"
    user?:User | NextMeetUser; //member
    userName?:string; //non-member
}