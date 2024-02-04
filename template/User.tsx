import { Event_t } from "./Event";

export type User={
    userId:string;
    password:string;
    eventList:Event_t[];
}