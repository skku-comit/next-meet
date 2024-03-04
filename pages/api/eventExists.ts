import connectDB from "@/lib/mongodb/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";

export enum EVENT_SEARCH_RESPONSE { "NOT_FOUND" = 0, "EXISTING", "INTERNAL_SERVER_ERROR" };

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    console.log("connect");
    const reqBody = await JSON.parse(req.body);
    console.log(reqBody);
    let existingEvent = await Event.findOne({ eventID : parseInt(reqBody.eventID) });
    if(existingEvent){
      return res.status(400).json({ message: EVENT_SEARCH_RESPONSE.EXISTING });
    }
    return res.status(200).json({ message: EVENT_SEARCH_RESPONSE.NOT_FOUND });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: EVENT_SEARCH_RESPONSE.INTERNAL_SERVER_ERROR }); // Handle internal server errors
  }
};

export default POST;