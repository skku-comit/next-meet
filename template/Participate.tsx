import { NextMeetUser, User } from "./User"

export type Participate = {
    time:string; //ex) "2024-2-11 11:00"
    user:User | NextMeetUser; //member
}