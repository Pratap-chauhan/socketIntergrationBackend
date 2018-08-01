import { Request, Response } from 'express';

import Job from '../models/Job';
import JobService from '../services/JobService';
import Pagination from '../services/Pagination';

export default class JobController {
  static async index(req: Request, res: Response) {
    const { query } = req;

    if (!query.page) {
      query.page = 1;
    }

    if (!query.per_page) {
      query.per_page = 20;
    }

    if (!query.sort_by || (query.sort_by && ['title', 'updatedAt'].indexOf(query.sort_by) === -1)) {
      query.sort_by = 'createdAt';
    }

    if (!query.sort_as || (query.sort_as && query.sort_as === 'desc')) {
      query.sort_as = -1;
    } else {
      query.sort_as = 1;
    }

    // Archived Jobs Filter
    if (query.archived) {
      query.archived = Boolean(query.archive);
    } else {
      query.archived = false;
    }

    const finder = {
      user: req.user._id,
      archived: query.archived
    };

    try {
      const jobs = await Job.find(finder)
        .skip(Number(query.page - 1) * Number(query.per_page))
        .limit(Number(query.per_page))
        .sort({ [query.sort_by]: query.sort_as })
        .populate('user', 'firstName lastName pictureUrl');

      const totalJobs = await Job.count(finder);
      const paginate = Pagination(totalJobs, jobs.length, query.per_page, query.page);
      return res.json({ error: false, data: { jobs, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async create(req: Request, res: Response) {
    if (!req.user.company_id) {
      return res.json({ error: true, status: 422, message: 'Please add the company' });
    }

    try {
      const data = req.body;
      const errors = JobService.validate(data);
      if (errors) {
        return res.json({ error: true, status: 422, message: 'Validation failed', data: errors });
      }
      data.user = req.user._id;
      data.company = req.user.company_id;
      const job = await Job.create(data);
      return res.json({
        error: false,
        status: 201,
        message: 'Job posted successfully.',
        data: job
      });
    } catch (e) {
      return res.json({ error: true, status: 500, message: `An error occured. ${e.message}` });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id).populate('user', 'firstName lastName pictureUrl');
      if (!job) {
        return res.json({ error: true, status: 404, message: 'Job not found.' });
      }
      return res.json({ error: false, data: job });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async public(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id).populate('user', 'firstName lastName');
      if (!job) {
        return res.json({ error: true, status: 404, message: 'Job not found.' });
      }
      return res.json({ error: false, data: job });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const data = req.body;
      const errors = JobService.validate(data);
      if (errors) {
        return res.json({ error: true, status: 422, message: 'Validation failed', data: errors });
      }
      data.user = req.user._id;

      const { id } = req.params;
      let job: any = await Job.findById(id);

      // No Job
      if (!job) {
        return res.json({ error: true, status: 404, message: 'Job not found.' });
      }

      // Job is archived
      if (job.archived) {
        return res.json({ error: true, status: 422, message: 'Job is archived and can not be updated.' });
      }

      job = job.toJSON();
      job = { ...job, ...data };
      await Job.findByIdAndUpdate(id, { $set: job });
      return res.json({ error: false, data: job, message: 'Job updated successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async archive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);
      if (job.user !== req.user._id) {
        return res.json({ error: true, status: 401, message: 'Unauthorized.' });
      }
      await Job.findByIdAndUpdate({ _id: id }, { $set: { archived: true } });
      return res.json({ error: false, message: 'Job archived successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);
      if (job.user !== req.user._id) {
        return res.json({ error: true, status: 401, message: 'Unauthorized.' });
      }
      await Job.findByIdAndRemove(id);
      return res.json({ error: false, message: 'Job deleted successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }
}
