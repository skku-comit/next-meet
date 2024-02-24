import connectDB from "@/lib/mongodb/connectDB";
import NextMeetUser from "@/template/schema/user.model";
import { NextApiRequest, NextApiResponse } from "next";

export enum USER_SEARCH_RESPONSE { "NOT_FOUND" = 0, "EXISTING_LOGINID", "EXISTING_EMAIL", "INTERNAL_SERVER_ERROR" };

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const { loginID, email } = await req.body;
    let existingUser = await NextMeetUser.findOne({ loginID }).select("_id");
    if(existingUser){
      return res.status(400).json({ message: USER_SEARCH_RESPONSE.EXISTING_LOGINID });
    }
    existingUser = await NextMeetUser.findOne({ email }).select("_id");
    if(existingUser){
        return res.status(400).json({ message: USER_SEARCH_RESPONSE.EXISTING_EMAIL });
    }
    return res.status(200).json({ message: USER_SEARCH_RESPONSE.NOT_FOUND });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: USER_SEARCH_RESPONSE.INTERNAL_SERVER_ERROR }); // Handle internal server errors
  }
};

export default POST;