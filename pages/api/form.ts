import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import connectDB from "@/lib/mongodb/connectDB";
import { User } from "@/template/User";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";
import { TimeInfo } from "@/template/TimeInfo";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();

      //check input
      console.log(req.body);
      
      //assign new eventID
      const newEventID = getID(3);

      //define host
      let { userID, userName, password } = req.body.hostUserInfo as User;
      const host: User = { userID, userName, password };

      //define timeInfo
      const { isWeekly, startTime, endTime, dayList, dateList } = req.body.timeInfo as TimeInfo;
      const timeInfo: TimeInfo = { isWeekly, startTime, endTime, dayList, dateList };

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
        timeInfo: timeInfo,
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
  else if(req.method === "GET"){
    try {
      await connectDB();

      const {eventID} = req.query;

      const event = await Event.findOne({ eventID: eventID });

      res.status(201).json({ event : event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server issue occurred" });
    }


    res.status(200).json({});
  }
};

export default handler;
