import { Request, Response } from "express";
import Pagination from "../services/Pagination";
import Match from "../models/Match";
import { Types } from "mongoose";
import { isMongoId } from 'validator';

export default class MatchController {
  static async index(req: Request, res: Response) {
    let { body, user } = req;

    let job, candidate, type;
    const hr = { _id: 1, name: 1, firstName: 1, lastName: 1, avatar: 1 };
    const company = {
      _id: 1,
      title: 1,
      description: 1,
      logo: 1
    };

    if (user.role === "hr") {
      type = "hr";
      body = MatchController.processInputBody(body, "hr");
      job = {
        _id: 1,
        title: 1,
        company
      };
      candidate = {
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
      };
    } else {
      type = "candidate";
      body = MatchController.processInputBody(body, "candidate");
      job = {
        _id: 1,
        company,
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
      };
      candidate = { _id: 1, name: 1 };
    }

    const $match = {
      "score.total": { $gt: 0 },
      [type]: user._id
    };

    // if (req.body.job_id) {
    //   $match["job"] = Types.ObjectId(req.body.job_id);
    // }

    const aggregate = [
      {
        $match
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
        $lookup: {
          from: "companies",
          localField: "job.company",
          foreignField: "_id",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      { $match: body.finder },
      { $sort: { [body.sort_by]: body.sort_as } },
      { $skip: body.per_page * (body.page -1) },
      { $limit: body.per_page },
      {
        $project: {
          _id: 0,
          score: 1,
          job,
          hr,
          candidate
        }
      }
    ];

    const countAggregate = [
      {
        $match
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
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ];

    try {
      const data = await Match.aggregate(aggregate);
      const count = await Match.aggregate(countAggregate);
      const paginate = Pagination(
        count[0] ? count[0].count : 0,
        data.length,
        body.per_page,
        body.page
      );

      return res.json({ error: false, data: { paginate, data } });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  private static processInputBody(body, role) {
    body.page = Number(body.page) || 1;
    body.per_page = Number(body.per_page) || 20;

    const finder = {};
    let prefix = "";

    if (role === "hr") {
      prefix = "candidate";
      if (body.job_id && isMongoId(body.job_id)) {
        finder["job._id"] = Types.ObjectId(body.job_id);
      }
    } else {
      prefix = "job";
    }

    const allowedSorts = ["name", "title", "createdAt", "updatedAt"];

    if (
      !body.sort_by ||
      (body.sort_by && allowedSorts.indexOf(body.sort_by) === -1)
    ) {
      body.sort_by = "score.total";
    } else {
      body.sort_by = `${prefix}.{body.sort_by}`;
    }

    if (!body.sort_as || (body.sort_as && body.sort_as === "desc")) {
      body.sort_as = -1;
    } else {
      body.sort_as = 1;
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
    if (body.role && body.role.length > 0) {
      finder[`${prefix}.experience_role`] = { $in: body.role };
    }

    body.finder = finder;
    return body;
  }
}
