import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import NextMeetUserG from "@/template/schema/userG.model";

export enum SIGNIN_ERROR_G {
  NO_ERROR = 0,
  NO_ERROR_NEW_USER,
  INTERNAL_SERVER_ERROR,
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();
      // Check if the member is in database
      const checkQuery = await NextMeetUserG.find({ email: req.body.email });

      console.log(checkQuery);
      // Member already exist
      if (checkQuery.length) {
        return res.status(200).json({ isNew: false });
      }

      // Register new member
      const user = NextMeetUserG;
      const { email, userName } = req.body;

      await user.create({
        userID: getID(1),
        userName,
        email,
      });

      console.log(`${userName} registered as user`);
      return res.status(201).json({ isNew: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error occurred" });
    }
  }
};

export default handler;