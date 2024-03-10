// import type { NextApiRequest, NextApiResponse } from "next";
// import Event from "@/template/schema/event.model";
// import connectDB from "@/lib/mongodb/connectDB";
// import { User } from "@/template/User";
// import NextMeetUser from "@/template/schema/user.model";
// import { TimeInfo } from "@/template/TimeInfo";
// import { Participate } from "@/template/Participate";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "PATCH") {
//     try {
//         await connectDB();

//         const event = await Event.findOne({ eventID: req.body.eventID });
//         const participate = event.participateStatus as Participate[][];

//         let userIdx = 0;
//         for (let i = 0; i < participate.length; ++i) {
//             if (req.body.userInfo.userID === participate[i][0].user[i].userID) {
//                 userIdx = i;
//                 break;
//             }
//         }
//         if (userIdx) {
//             participate[userIdx] = [];
//             await event.save();
//         } else {
//             userIdx = participate.length;
//             participate.push([]);
//         }
        
//         const user = req.body.user;
//         for (let date in req.body.dates) {
//             participate[userIdx].push({ time: date, user });
//         }
//         participate[userIdx].sort();
        
//         await event.save();
//         res.json({ message: "saved" });
//     } catch (error) {
//         console.error(error);
//         res.json({ message: "Internal server error" });
//     }
//   } else if (req.method === "GET") {
//     try {
//         await connectDB();

//         const event = await Event.findOne({ eventID: req.body.eventID });
//         const participate = event.participateStatus as Participate[][];

//         const queryTime: Date = req.body.time;
//         const userList: User[] = [];
//         for (let i = 0; i < participate.length; ++i) {
//             for (let j = 0; j < participate[i].length; ++j) {
//                 if (queryTime === participate[i][j].time) {
//                     userList.push(participate[i][j].user);
//                     break;
//                 }
//             }
//         }

//         res.json({ list: userList });
//     } catch (error) {
//         console.error(error);
//     }
//   }
// };

// export default handler;

// // const processData = (dates: string[], data: Participate[], user: User) => {
// //     for (let date in dates) {
// //         data.push({ time: date, user });
// //     }    

// //     data.sort();
// //     return;
// // }