import { User } from "./User";

export type Event_t = {
    eventName:string;
    eventID:string;
    fixedDate:Date|null;
    hostUser?:User;
    hostName?:string;
    hostPW?:string;
}