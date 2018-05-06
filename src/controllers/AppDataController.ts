import { Request, Response } from 'express';

import AppData from '../models/AppData';
import Pagination from '../services/Pagination';
export default class AppDataController {

  static async skills(req: Request, res: Response) {
    req.query.type = 'skills';
    return AppDataController.findData(req, res);
  }

  static async designations(req: Request, res: Response) {
    req.query.type = 'designations';
    return AppDataController.findData(req, res);
  }

  static async domains(req: Request, res: Response) {
    req.query.type = 'domains';
    return AppDataController.findData(req, res);
  }

  static async features(req: Request, res: Response) {
    req.query.type = 'features';
    return AppDataController.findData(req, res);
  }

  private static async findData(req: Request, res: Response) {
    let { q, type } = req.query;

    const project = { _id: 1, title: 1 };
    if (type === 'skills') {
      project['parent'] = 1;
    }

    const finder = { type };
    // Searching
    if (q) {
      finder['title'] = new RegExp(q, 'ig');
    }

    try {
      const data = await AppData.find(finder, project).sort({ title: 1 });
      return res.json({ error: false, data });
    } catch (e) {
      return res.status(500).json({ error: true, message: 'An error occured.', e});
    }
  }
}