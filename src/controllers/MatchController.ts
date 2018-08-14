import { Request, Response } from "express";
import User from "../models/User";
import Pagination from "../services/Pagination";
import Job from "../models/Job";
import JobService from "../services/JobService";
import Match from "../models/Match";

export default class MatchController {
  static index(req: Request, res: Response) {
    if (req.user.role === "hr") {
      return MatchController.hrMatches(req, res);
    } else {
      return MatchController.candidateMatches(req, res);
    }
  }

  // Show candidates for HR
  private static async hrMatches(req: Request, res: Response) {
    let { body } = req;
    body = MatchController.processInputBody(body, "hr");

    const aggregate = [
      {
        $match: {
          "score.total": { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 0,
          score: 1,
          job: {
            _id: 1,
            company: 1,
            availability: 1,
            createdAt: 1,
            updatedAt: 1,
            description: 1,
            domains: 1,
            locations: 1,
            looking_for: 1,
            modules: 1,
            skills: 1,
            title: 1
          },
          hr: { _id: 1, name: 1, firstName: 1, lastName: 1, avatar: 1 },
          candidate: {
            _id: 1,
            name: 1,
            avatar: 1,
            bio: 1,
            bioHTML: 1,
            locations: 1,
            projects: 1,
            skills: 1,
            salary: 1,
            experience_role: 1,
            designation: 1,
            avaiablility: 1,
            looking_for: 1
          }
        }
      }
    ];

    try {
      const data = await Match.aggregate(aggregate);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  // Show jobs for candidates
  private static async candidateMatches(req: Request, res: Response) {
    let { body } = req;
    body = MatchController.processInputBody(body, "candidate");

    const aggregate = [
      {
        $match: {
          "score.total": { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 0,
          score: 1,
          job: {
            _id: 1,
            company: 1,
            availability: 1,
            createdAt: 1,
            updatedAt: 1,
            description: 1,
            domains: 1,
            locations: 1,
            looking_for: 1,
            modules: 1,
            skills: 1,
            title: 1
          },
          hr: { _id: 1, name: 1, firstName: 1, lastName: 1, avatar: 1 },
          candidate: { _id: 1, name: 1 }
        }
      }
    ];

    try {
      const data = await Match.aggregate(aggregate);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  private static processInputBody(body, role) {
    body.page = Number(body.page) || 1;
    body.per_page = Number(body.per_page) || 20;

    const allowedSorts = ["name", "title", "createdAt", "updatedAt"];

    if (
      !body.sort_by ||
      (body.sort_by && allowedSorts.indexOf(body.sort_by) === -1)
    ) {
      body.sort_by = "createdAt";
    }

    if (!body.sort_as || (body.sort_as && body.sort_as === "desc")) {
      body.sort_as = -1;
    } else {
      body.sort_as = 1;
    }

    const finder = {};
    let prefix = "";

    if (role === "hr") {
      prefix = "candidate";
      if (body.role && body.role.length > 0) {
        finder["candidate.experience_role"] = { $in: body.role };
      }
    } else {
      prefix = "job";
    }

    if (body.q) {
      finder[`${prefix}.name`] = new RegExp(body.q, "ig");
    }
    if (body.locations && body.locations.length > 0) {
      finder[`${prefix}.locations`] = { $in: body.locations };
    }
    if (body.type && body.type.length > 0) {
      finder[`${prefix}.looking_for`] = { $in: body.type };
    }

    body.finder = finder;
    return body;
  }
}
