import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/lib/models/event.model";
import Member from "@/lib/models/member.model";
import connectDB from "@/lib/mongodb/connectDB";
import { User } from "@/template/User";
import getID from "@/lib/functions/getID";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
{
    if (req.method === "POST")
    {
        try
        {
            await connectDB(); 
            
            const newEventID = getID(3);
            let { userID, userName, password } = req.body.hostUserInfo as User;
            if (!userID)    // If userID == 0, this host is not a member so ID should be generated.
            {
                userID = getID(2);
            }
            else    // If member, add the ID of new event to member's event list
            {
            }
            const host: User = { userID, userName, password };
            await Event.create
            ({
                eventID: newEventID,
                eventName: req.body.eventName,
                description: req.body.description,
                startTime: req.body.timeInfo.startHour,
                endTime: req.body.timeInfo.endHour,
                users: [host],
                participateStatus: [],
                fixedMeeting: [],
                hostUserInfo: host,
            });

            
            const member = await Member.findOne({ memberID: userID });
            (member.eventIDList as number[]).push(newEventID);
            await member.save();

            res.status(201).json({ eventID: newEventID, eventURL: `/${newEventID}` });
        }
        catch (error)
        {
            console.error(error);
            res.status(500).json({ message: "Internal server issue occurred" });
        }
    }
}

export default handler;