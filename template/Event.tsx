import { User } from "./User";

export type Event_t = {
    eventID:string;
    eventName:string;
    fixedDate:Date|null;
    host:User;
}