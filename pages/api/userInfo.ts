import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb/connectDB";
import NextMeetUser from "@/template/schema/user.model";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();

      const user = await NextMeetUser.findOne({ email: req.body.email });

      //console.log(user);

      console.log("This is userInfo API");
      const userInfo = user._doc;
      console.log(userInfo);
      return user ? res.status(200).json(userInfo) : res.status(403).json({ message: "Failed to find user"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error occurred" });
    }
  }
};

export default handler;
