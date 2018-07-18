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
    let { query } = req;
    query = MatchController.processInputQuery(query);

    const finder: any = {
      role: 'candidate'
    };

    if (query.q) {
      finder.name = new RegExp(query.q, 'ig');
    }

    try {
      const users = await User.find(finder)
        .skip(Number(query.page - 1) * Number(query.per_page))
        .limit(Number(query.per_page))
        .sort({ [query.sort_by]: query.sort_as });

      const totalUsers = await User.count(finder);
      const paginate = Pagination(totalUsers, users.length, query.per_page, query.page);
      return res.json({ error: false, data: { users, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  // Show jobs for candidates
  private static async candidateMatches(req: Request, res: Response) {
    let { query } = req;
    query = MatchController.processInputQuery(query);

    const finder: any = { };

    if (query.q) {
      finder.title = new RegExp(query.q, 'ig');
    }

    try {
      const jobs = await Job.find(finder)
        .skip(Number(query.page - 1) * Number(query.per_page))
        .limit(Number(query.per_page))
        .sort({ [query.sort_by]: query.sort_as });

      const totalJobs = await Job.count(finder);
      const paginate = Pagination(totalJobs, jobs.length, query.per_page, query.page);
      return res.json({ error: false, data: { jobs, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static processInputQuery(query) {
    query.page = Number(query.page) || 1;
    query.per_page = Number(query.per_page) || 20;

    const allowedSorts = ['name', 'title', 'createdAt', 'updatedAt'];

    if (!query.sort_by || (query.sort_by && allowedSorts.indexOf(query.sort_by) === -1)) {
      query.sort_by = 'createdAt';
    }

    if (!query.sort_as || (query.sort_as && query.sort_as === 'desc')) {
      query.sort_as = -1;
    } else {
      query.sort_as = 1;
    }

    return query;
  }
}