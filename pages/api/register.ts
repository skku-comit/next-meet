import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();
      // Check if the member is in database
      const checkQuery = await NextMeetUser.find({ loginID: req.body.loginID });

      // Member already exist
      if (checkQuery.length !== 0) {
        res.status(200).json({ isNew: false });
      }

      // Register new member
      const user = NextMeetUser;
      const { userName, loginID, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await user.create({
        loginID,
        password: hashedPassword,
        userID: getID(1),
        userName,
        email,
      });

      console.log(`${userName} registered as user`);
      res.status(201).json({ isNew: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error occurred" });
    }
  }
};

export default handler;
