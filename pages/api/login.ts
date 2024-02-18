import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/lib/models/event.model";
import Member from "@/lib/models/member.model";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
{
    if (req.method === "GET")
    {
        try
        {
            await connectDB(); 
            
            // Find member
            const member = await Member.findOne({ loginID: req.body.loginID, password: req.body.password });

            if (member)
            {
                res.status(200).json({ userID: member.memberID });
            }
            else
            {
                res.status(200).json({ userID: 0 });
            }
        }
        catch (error)
        {
            console.error(error);
            res.status(500).json({ message: "Internal server issue occurred" });
        }
    }
    else if (req.method === "PUT")
    {
        try
        {
            await connectDB();

            const event = await Event.findOne({ eventID: req.body.eventID });
            const newUserId = getID(2);
            (event.users as number[]).push(newUserId);
            await event.save();

            res.status(200).json({ userId: newUserId });
        }
        catch (error)
        {
            console.error(error);
            res.status(500).json({ message: "Internal server issue occurred" });
        }
    }
}

export default handler;