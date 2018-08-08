import { Request, Response } from 'express';
import User from '../models/User';
import Pagination from '../services/Pagination';
import Job from '../models/Job';

export default class MatchController {

  static index(req: Request, res: Response) {
    if (req.user.role === 'hr') {
      return MatchController.hrMatches(req, res);
    } else {
      return MatchController.candidateMatches(req, res);
    }
  }

  // Show candidates for HR
  private static async hrMatches(req: Request, res: Response) {
    let { body } = req;
    body = MatchController.processInputBody(body);

    const finder: any = {
      role: 'candidate'
    };

    if (body.q) {
      finder.name = new RegExp(body.q, 'ig');
    }

    if (body.role && body.role.length > 0) {
      finder.experience_role = { $in: body.role };
    }

    if (body.type && body.type.length > 0) {
      finder.looking_for = { $in: body.type };
    }

    if (body.locations && body.locations.length > 0) {
      finder.locations = { $in: body.locations };
    }

    try {
      const users = await User.find(finder)
        .skip(Number(body.page - 1) * Number(body.per_page))
        .limit(Number(body.per_page))
        .sort({ [body.sort_by]: body.sort_as });

      const totalUsers = await User.count(finder);
      const paginate = Pagination(totalUsers, users.length, body.per_page, body.page);
      return res.json({ error: false, data: { users, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  // Show jobs for candidates
  private static async candidateMatches(req: Request, res: Response) {
    let { body } = req;
    body = MatchController.processInputBody(body);

    const finder: any = { };

    if (body.q) {
      finder.title = new RegExp(body.q, 'ig');
    }

    if (body.type && body.type.length > 0) {
      finder.looking_for = { $in: body.type };
    }

    if (body.locations && body.locations.length > 0) {
      finder.locations = { $in: body.locations };
    }

    try {
      const jobs = await Job.find(finder)
        .skip(Number(body.page - 1) * Number(body.per_page))
        .limit(Number(body.per_page))
        .sort({ [body.sort_by]: body.sort_as })
        .populate({path: 'company', select: ['_id', 'title', 'linkedin']});

      const totalJobs = await Job.count(finder);
      const paginate = Pagination(totalJobs, jobs.length, body.per_page, body.page);
      return res.json({ error: false, data: { jobs, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static processInputBody(body) {
    body.page = Number(body.page) || 1;
    body.per_page = Number(body.per_page) || 20;

    const allowedSorts = ['name', 'title', 'createdAt', 'updatedAt'];

    if (!body.sort_by || (body.sort_by && allowedSorts.indexOf(body.sort_by) === -1)) {
      body.sort_by = 'createdAt';
    }

    if (!body.sort_as || (body.sort_as && body.sort_as === 'desc')) {
      body.sort_as = -1;
    } else {
      body.sort_as = 1;
    }

    return body;
  }
}