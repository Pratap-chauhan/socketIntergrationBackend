import { Request, Response } from "express";
import { InterestEvents } from "../events/InterestEvents";
import Message from "../models/Message";

export default class InterestController {
  static async toggle(req: Request, res: Response) {
    const errors = InterestController.validate(req.user, req.body, 'toggle');
    if (errors) {
      return res.json({
        error: true,
        status: 422,
        data: errors
      });
    }

    const interest = {
      job: req.body.job,
      to: req.body.to,
      from: req.user._id,
      text:
        req.user.role === "candidate"
          ? "Hi, I am interested in this job."
          : "Hi, it seems you are a good fit for this job and we would like to continue the process."
    };

    // When interest is sent, we initilize a new message (that's it)
    // If message with interest is not found, then we have to send one
    // Else we have to archive that job for that candidate or archive that candidate for that HR

    const messageQuery = {
      job: interest.job,
      $or: [{ from: interest.from }, { to: interest.from }]
    };

    try {
      const message = await Message.findOne(messageQuery);
      if (message) {
        await Message.updateMany(messageQuery, { $set: { archived: true } });
        InterestEvents.removed(interest);
        return res.json({ error: false, message: "Interest removed." });
      } else {
        await Message.create(interest);
        InterestEvents.created(interest);
        return res.json({ error: false, message: "Interest sent." });
      }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async canApply(req: Request, res: Response) {
    const errors = InterestController.validate(req.user, req.body);
    if (errors) {
      return res.json({
        error: true,
        status: 422,
        data: errors
      });
    }

    // If loggedin user is hr, toId is candidate id and if loggedin user is candidate, toId is job id
    const messageQuery: any = {
      job: req.body.job,
      $or: [{ from: req.user._id }, { to: req.user._id }]
    };

    try {
      let message = await Message.findOne(messageQuery);

      if (!message) {
        return res.json({ error: false, data: { canApply: true, canWithDraw: false }});
      }

      // If user has archived
      messageQuery.archived = false;
      message = await Message.findOne(messageQuery);

      if(!message) {
        return res.json({ error: false, data: { canApply: false, canWithdraw: true }});
      }
      return res.json({ error: false, data: { canApply: false, canWithdraw: false }});
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  private static validate(user, data, type = null) {
    const errors = [];

    if (user.role === "hr") {
      if (!data.job) {
        errors.push({ path: "job", text: "Job is required." });
      }
      if (!data.to) {
        errors.push({ path: "to", text: "Candidate is required." });
      }
    } else {
      if (!data.job) {
        errors.push({ path: "job", text: "Job is required." });
      }
      if(type && type === 'toggle') {
        if (!data.to) {
          errors.push({ path: "to", text: "HR is required." });
        }
      }
    }
    return errors.length > 0 ? errors : false;
  }
}
