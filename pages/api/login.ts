import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import bcrypt from "bcryptjs";
import NextMeetUser from "@/template/schema/user.model";
import { NM_CODE } from "@/lib/msg/errorMessage";

//for finding registered NextMeetUser
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();

      // Find member
      const user = await NextMeetUser.findOne({ loginID: req.body.loginID });
      if (user) {
        const passwordCheck = await bcrypt.compare(req.body.password, user.password);
        if (passwordCheck) {
          const { password, ...dataWithoutPassword } = user._doc;          
          return res.status(200).json({
            message: NM_CODE.NO_ERROR,
            user: {...dataWithoutPassword},
          });
        } 
      }
      
      return res.status(400).json({ message: NM_CODE.LOGIN_FAILED, user:null });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: NM_CODE.INTERNAL_SERVER_ERROR, user:null });
    }
  } else if (req.method === "PUT") {
    try {
      await connectDB();

      const event = await Event.findOne({ eventID: req.body.eventID });
      const newUserId = getID(2);
      (event.users as number[]).push(newUserId);
      await event.save();

      res.status(200).json({ userId: newUserId, message: NM_CODE.NO_ERROR });
    } catch (error) {
      console.error(error);
      res.status(500).json({ userId: null, message: NM_CODE.INTERNAL_SERVER_ERROR });
    }
  }
};

export default handler;
