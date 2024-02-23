import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import bcrypt from "bcryptjs";
import NextMeetUser from "@/template/schema/user.model";

export enum LOGIN_FAIL_ERR {
  "NO_ERROR" = 0,
  "NOT_EXISTING_USERID",
  "INCORRECT_PW",
  "ETC",
}

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
{
    if (req.method === "GET")
    {
        try
        {
            await connectDB(); 
            
            // Find member
            const user = await NextMeetUser.findOne({ loginID: req.body.loginID });

            if (user)
            {
              const { userID, password } = await req.body;
              const passwordCheck = await bcrypt.compare(password, user.password);
              if (passwordCheck) {
                const { password, ...dataWithoutPassword } = user._doc;
                return res.json({
                  message: LOGIN_FAIL_ERR.NO_ERROR,
                  ...dataWithoutPassword,
                });
              } else {
                return res.json({ message: LOGIN_FAIL_ERR.INCORRECT_PW });
              }
                //res.status(200).json({ userID: user.userID });
            }
            else
            {
              return res.json({ message: LOGIN_FAIL_ERR.NOT_EXISTING_USERID });
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