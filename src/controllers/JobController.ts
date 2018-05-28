import { Request, Response } from 'express';

import Job from '../models/Job';
import JobService from '../services/JobService';
import Pagination from '../services/Pagination';

export default class JobController {

  static async index(req: Request, res: Response) {
    const { query } = req;

    if (!query.page) {
      query.page = 1
    }

    if (!query.per_page) {
      query.per_page = 20
    }

    if (!query.sort_by || (query.sort_by && ['title', 'updatedAt'].indexOf(query.sort_by) === -1)) {
      query.sort_by = 'createdAt';
    }

    if (!query.sort_as || (query.sort_as && query.sort_as === 'desc')) {
      query.sort_as = -1;
    } else {
      query.sort_as = 1;
    }

    const finder = {
      user: req.user._id
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
      return res.status(500).send('An error occured' + e.message);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const errors = JobService.validate(data);
      if (errors) {
        return res.status(422).json({ error: true, message: 'Validation failed', data: errors });
      }
      data.user = req.user._id;
      const job = await Job.create(data);
      return res.status(201).json({ error: false, message: 'Job posted successfully.', data: job });
    } catch (e) {
      return res.status(500).send('An error occured.');
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id).populate('user', 'firstName lastName pictureUrl');
      if (!job) {
        return res.status(404).send('Job not found.');
      }
      return res.json({ error: false, data: job });
    } catch (e) {
      return res.status(500).json('An error occured.');
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const data = req.body;
      const errors = JobService.validate(data);
      if (errors) {
        return res.status(422).json({ error: true, message: 'Validation failed', data: errors });
      }
      data.user = req.user._id;

      const { id } = req.params;
      let job = await Job.findById(id);
      if (!job) {
        return res.status(404).send('Job not found.');
      }
      job = job.toJSON();
      job = { ...job, ...data };
      await Job.findByIdAndUpdate(id, { $set: job });
      return res.json({ error: false, data: job, message: 'Job updated successfully.' });
    } catch (e) {
      return res.status(500).json('An error occured.');
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await Job.findByIdAndRemove(id);
      return res.json({ error: false, message: 'Job deleted successfully.' });
    } catch (e) {
      return res.status(500).json('An error occured.');
    }
  }
}