import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import connectDB from "@/lib/mongodb/connectDB";
import { User } from "@/template/User";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();
      
      //assign new eventID
      const newEventID = getID(3);

      //define host
      let { userID, userName, password } = req.body.hostUserInfo as User;
      const host: User = { userID, userName, password };

      if (userID === 0) {
        // If userID == 0, this host is not a member so ID should be generated.
        userID = getID(2);
      } 
      else {
        // If member, add the ID of new event to member's event list
        const user = await NextMeetUser.findOne({ userID: userID });
        (user.eventIDList as number[]).push(newEventID);
        await user.save();
      }

      //create new event 
      await Event.create({
        eventID: newEventID,
        eventName: req.body.eventName,
        description: req.body.description,
        startTime: req.body.timeInfo.startHour,
        endTime: req.body.timeInfo.endHour,
        participateStatus: [],
        fixedMeeting: [],
        hostUserInfo: host,
      });

      res.status(201).json({ eventID: newEventID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server issue occurred" });
    }
  }
};

export default handler;
