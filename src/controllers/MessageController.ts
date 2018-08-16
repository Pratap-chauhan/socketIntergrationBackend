import { Request, Response } from "express";
import Message from "../models/Message";

export default class MessageController {
  // Data to show the sidebar of the messaging (all chats)
  static async index(req: Request, res: Response) {
    let { page, limit } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const user = req.user._id;

    const $match = {
      archived: false,
      $or: [{ from: user }, { to: user }]
    };

    if(req.query.job_id) {
      $match['job'] = req.query.job_id;
    }

    const aggregate = [
      {
        $match
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          createdAt: 1,
          text: 1,
          users: { from: "$from", to: "$to" },
          from: 1,
          to: 1,
          job: 1,
          userIds: [
            {
              $cond: {
                if: { $eq: ["$from", user] },
                then: "$from",
                else: "$to"
              }
            },
            {
              $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
            }
          ]
        }
      },
      {
        $group: {
          _id: { userIds: "$userIds", job: "$job" },
          users: { $first: "$users" },
          text: { $first: "$text" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $lookup: {
          localField: "users.from",
          foreignField: "_id",
          from: "users",
          as: "from"
        }
      },
      {
        $lookup: {
          localField: "users.to",
          foreignField: "_id",
          from: "users",
          as: "to"
        }
      },
      {
        $lookup: {
          localField: "_id.job",
          foreignField: "_id",
          from: "jobs",
          as: "job"
        }
      },
      { $unwind: "$from" },
      { $unwind: "$to" },
      { $unwind: "$job" },
      {
        $lookup: {
          localField: "job.company",
          foreignField: "_id",
          from: "companies",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      {
        $project: {
          _id: 0,
          text: 1,
          createdAt: 1,
          from: { _id: 1, name: 1, avatar: 1 },
          to: { _id: 1, name: 1, avatar: 1 },
          job: { _id: 1, title: 1, company: { _id: 1, title: 1, logo: 1 } }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];
    try {
      let messages = await Message.aggregate(aggregate);
      messages = messages.map(x =>
        MessageController.transformMessage(x, req.user._id)
      );
      return res.json({ error: false, data: messages });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  // Create a message
  static async create(req: Request, res: Response) {
    try {
      const errors = MessageController.validateMessage(req.body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors,
          message: "Validation failed."
        });
      }

      if (String(req.user._id) !== String(req.body.from)) {
        return res.json({ error: true, status: 401, message: "Unauthorized." });
      }

      if (String(req.user._id) === String(req.body.to)) {
        return res.json({
          error: true,
          status: 422,
          message: "Can not send message to yourself."
        });
      }

      let message = await Message.create(req.body);

      message = await Message.findById(message._id)
        .populate({ path: "to", select: ["_id", "name", "avatar"] })
        .populate({ path: "from", select: ["_id", "name", "avatar"] });

      message = MessageController.transformMessage(message, req.user._id);
      return res.json({
        error: false,
        message: "Message sent.",
        data: message
      });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  // Show a chat thread between passed user and the logged in user
  static async show(req: Request, res: Response) {
    let { page, limit } = req.query;
    const { otherUser } = req.params;

    if (req.user._id === otherUser) {
      return res.json({
        error: true,
        status: 400,
        message: "The other user id is invalid."
      });
    }

    if (!req.query.job_id) {
      return res.json({
        error: true,
        status: 422,
        message: "Validation failed.",
        data: [{ type: "job_id", message: "The job is required." }]
      });
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let finder: any = {
      $and: [
        { from: { $in: [req.user._id, otherUser] } },
        { to: { $in: [req.user._id, otherUser] } }
      ],
      job: req.query.job_id,
      archived: false
    };

    try {
      let messages = await Message.find(finder)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "job", select: ["_id", "title"] })
        .populate({ path: "to", select: ["_id", "name", "avatar"] })
        .populate({ path: "from", select: ["_id", "name", "avatar"] });
      messages = messages.map(x =>
        MessageController.transformMessage(x, req.user._id)
      );

      finder.seen = false;
      finder.to = req.user._id;
      await Message.find(finder).update({
        $set: { seen: true, seenAt: new Date() }
      });

      return res.json({ error: false, data: messages });
    } catch (e) {
      return res.json({
        error: false,
        status: 500,
        message: "An error occured."
      });
    }
  }

  // Create a message validation
  private static validateMessage(data) {
    const errors = [];
    if (!data.from) {
      errors.push({ type: "from", message: "Sender of message is required." });
    }

    if (!data.to) {
      errors.push({ type: "to", message: "Receiver of message is required." });
    }

    if (!data.text) {
      errors.push({ type: "text", message: "Text of message is required." });
    }

    if (!data.job) {
      errors.push({ type: "job", message: "Job of message is required." });
    }

    if (data.from && data.to && data.from === data.to) {
      errors.push({
        type: "to",
        message: "You can not send message to yourself."
      });
    }

    if (errors.length === 0) {
      return false;
    }
    return errors;
  }

  // Transform a message
  private static transformMessage(message: any, myId: any) {
    /**
     * LoggedInUser: Basit
     * {
     *    from: {id: 1,  name: 'Basit'},
     *    to: {id: 2,  name: 'Narek'},
     *    text: 'Yello'
     * }
     */
    if (message.toJSON) {
      message = message.toJSON();
    }
    // If message is from Basit to Narek
    if (String(message.from._id) === String(myId)) {
      message.me = message.from;
      message.other = message.to;
      message.position = "right";
    } else {
      message.me = message.to;
      message.other = message.from;
      message.position = "left";
    }

    delete message.to;
    delete message.from;
    return message;
  }
}
