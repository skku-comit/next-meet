import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import connectDB from "@/lib/mongodb/connectDB";
import { User } from "@/template/User";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";
import { TimeInfo } from "@/template/TimeInfo";
import { NM_CODE } from "@/lib/msg/errorMessage";

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
        userList:[host],
      });

      res.status(201).json({ eventID: newEventID});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: NM_CODE.INTERNAL_SERVER_ERROR });
    }
  }
  else if(req.method === "PUT"){
    try {
      console.log("put Connect")
      await connectDB();
      // If member, add the ID of new event to member's event list
      const reqBody = req.body;
      console.log("put reqBody", reqBody);
      const user = await NextMeetUser.findOne({ userID: reqBody.user.userID });
        // console.log("includes eventID", user.eventIDList.includes(parseInt(reqBody.eventID)))
      if(reqBody.state == "addEvent"){
        if(!((user.eventIDList as number[]).includes(parseInt(reqBody.eventID)))){
          (user.eventIDList as number[]).push(parseInt(reqBody.eventID));
          await user.save();
        }
        const set = new Set(user.eventIDList);
        const uniqueArr = Array.from(set);
        if(uniqueArr.length != user.eventIDList.length){
          // console.log("length gap", uniqueArr.length != user.eventIDList.length)
          await NextMeetUser.findOneAndUpdate({userID: reqBody.user.userID}, {$set:{eventIDList: uniqueArr}}, { overwrite: true })
          // console.log("done");
        }
      }
      
      const event = await Event.findOne({ eventID: reqBody.eventID });
      console.log(event)
      const existedUser = event.userList?.filter((eventuser:any)=>(eventuser.userID == reqBody.user.userID))

      console.log("existedUser addUser", existedUser)
      if(reqBody.state=="addUser"){
        if(!(existedUser.length > 0)){
          event.userList.push(user ? user : reqBody.user);
          await event.save();
        }
      }
      else if(reqBody.state=="removeUser"){
        if(existedUser.length > 0){
          await Event.findOneAndUpdate({ eventID:reqBody.eventID }, {$set:{userList: event.userList.filter((eventuser:any)=>(eventuser.userID != reqBody.user.userID))}}, { overwrite: true })
        }
      }
      
      // res.status(201).json({ data: [user,  existedUser]});
      res.status(201).json({ userID: user ? user.userID : reqBody.user.userID, existedUser : existedUser, message: NM_CODE.NO_ERROR });
    } catch (error) {
      console.error(error);
      res.status(500).json({ userID: null, existingUser:null, message: NM_CODE.INTERNAL_SERVER_ERROR });
    }
  }
  else if(req.method === "PATCH"){
    try {
      await connectDB();
      const reqBody = req.body;

      //check input
      console.log("reqBody", reqBody);
      
      //check present eventID
      // const {eventID} = req.query;
      // const event = await Event.findOne({ eventID: reqBody.eventID });
      if(req.body.state == "CONFIRM"){
        await Event.findOneAndUpdate({eventID: reqBody.eventID}, {$set:{fixedMeeting: reqBody.fixedMeeting}}, { overwrite: true })
      }
      else if(req.body.state == "EDIT"){
        console.log("Patch Edit")
        await Event.findOneAndUpdate({eventID: reqBody.eventID}, {$set:{participateStatus: reqBody.participateStatus}}, { overwrite: true })
      }
      res.status(201).json({ eventID: reqBody.eventID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: NM_CODE.INTERNAL_SERVER_ERROR });
    }
  }
  else if(req.method === "GET"){
    try {
      await connectDB();

      const { id } = req.query;
      console.log("eventID", id);
      let event; 
      // event = typeof eventID == "string" ? await Event.findOne({ eventID: parseInt(eventID) }) : "";
      event = await Event.findOne({ eventID: id });

      res.status(201).json({ event : event, message: NM_CODE.NO_ERROR });
    } catch (error) {
      console.error(error);
      res.status(500).json({ event: null, message: NM_CODE.INTERNAL_SERVER_ERROR });
    }
    //not found 
    res.status(200).json({ event: null , message: NM_CODE.ETC });
  }
};

export default handler;

