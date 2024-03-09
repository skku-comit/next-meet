import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";

export enum USER_SEARCH_RESPONSE { "NO_ERROR" = 0, "EXISTING_LOGINID", "EXISTING_EMAIL", "EXISTING_GOOGLE_ACCOUNT" = 11, "INTERNAL_SERVER_ERROR" = 99 };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (req.method === "POST") {
    const { provider, userName, loginID, password, email } = req.body;
    try {
      await connectDB();
      // Check if the member is in database
      let checkQuery;
      if(provider === 'credentials'){
        checkQuery = await NextMeetUser.find({ provider:'credentials', loginID: req.body.loginID });
        if (checkQuery.length !== 0) {
          // Member already exist
          res.status(400).json({ message: USER_SEARCH_RESPONSE.EXISTING_LOGINID });
          return;
        }
      }
      else{
        checkQuery = await NextMeetUser.find({ provider:'google', email: req.body.email }); //google login
        if (checkQuery.length !== 0) {
          // Member already exist
          res.status(400).json({ message: USER_SEARCH_RESPONSE.EXISTING_GOOGLE_ACCOUNT });
          return;
        }
      }

      // Register new member
      const user = NextMeetUser;
      const hashedPassword = await bcrypt.hash(password, 10);

      await user.create({
        provider:provider,
        loginID,
        password: hashedPassword,
        userID: getID(1),
        userName,
        email,
      });

      console.log(`${userName} registered as user`);
      res.status(200).json({ message: USER_SEARCH_RESPONSE.NO_ERROR });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: USER_SEARCH_RESPONSE.INTERNAL_SERVER_ERROR });
    }
  // }
};

export default handler;
