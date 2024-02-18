import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/lib/models/event.model";
import Member from "@/lib/models/member.model";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
{
    if (req.method === "POST")
    {
        try
        {
            await connectDB(); 
            
            const Events = Event;
            const newEventID = getID(3);
            await Events.create
            ({
                eventID: newEventID,
                eventName: req.body.eventName,
                description: req.body.description,
                startTime: req.body.timeInfo.startHour,
                endTime: req.body.timeInfo.endHour,
                users: [],
                participateStatus: [],
                fixedMeeting: [],
                hostUserInfo: req.body.hostUserInfo,
            });

            const member = await Member.findOne({ memberID: req.body.hostUserInfo.userID });
            if (member)
            {
                (member.eventIDList as number[]).push(newEventID);
                await member.save();
            }

            res.status(201).json({ eventID: newEventID, eventURL: "" });
        }
        catch (error)
        {
            console.error(error);
            res.status(500).json({ message: "Internal server issue occurred" });
        }
    }
}

export default handler;