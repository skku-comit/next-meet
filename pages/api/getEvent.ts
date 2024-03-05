import connectDB from "@/lib/mongodb/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import { NextMeetEvent } from "@/template/Event";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    console.log("connected to Mongodb");
    const reqBody = await req.body;
    console.log(reqBody);
    
    const existingEvent: NextMeetEvent|null = await Event.findOne({ eventID : parseInt(reqBody.eventID) });
    console.log('existingEvent:',existingEvent);
    if(existingEvent){
      return res.status(400).json({ existingEvent });
    }
    return res.status(200).json( null );
  } catch (error) {
    console.error(error);
    return res.status(500).json( null ); // Handle internal server errors
  }
};

export default POST;