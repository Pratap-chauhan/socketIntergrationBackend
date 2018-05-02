import { Request, Response } from 'express';

import AppData from '../models/AppData';
import Pagination from '../services/Pagination';
export default class AppDataController {

  static async skills(req: Request, res: Response) {
    let { q, page, per_page } = req.query;

    // Paginate
    page = Number(page) - 1 || 0;
    per_page = Number(per_page) || 20;

    // Project
    const project = { _id: 1, title: 1, parent: 1 };
    // Finder object
    const finder = {
      type: 'skills',
    };
    // Searching
    if (q) {
      finder['title'] = new RegExp(q, 'ig');
    }

    try {
      const skills = await AppData.find(finder, project)
                                  .sort({title: 1})
                                  .skip(per_page * page)
                                  .limit(per_page);

      const count = await AppData.count(finder);

      return res.json({
        error: false,
        data: {
          paginate: Pagination(count, skills.length, per_page, page),
          skills
        }
      });
    } catch (e) {
      return res.status(500)
                .json({ error: true, message: 'An error occured.' });
    }
  }

  static async designations(req: Request, res: Response) {
    let { q } = req.query;

    // Project
    const project = { _id: 1, title: 1 };
    // Finder object
    const finder = {
      type: 'user_roles',
    };
    // Searching
    if (q) {
      finder['title'] = new RegExp(q, 'ig');
    }

    try {
      const roles = await AppData.find(finder, project).sort({ title: 1 });
      return res.json({
        error: false,
        data: roles
      });
    } catch (e) {
      return res.status(500).json({ error: true, message: 'An error occured.' });
    }
  }
}